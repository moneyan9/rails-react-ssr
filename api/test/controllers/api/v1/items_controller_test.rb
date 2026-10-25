require "test_helper"

class Api::V1::ItemsControllerTest < ActionDispatch::IntegrationTest
  test "lists items" do
    get api_v1_items_path, as: :json

    assert_response :ok
    skus = JSON.parse(response.body).fetch("items").map { |item| item.fetch("sku") }
    assert_equal [ "CF-200", "MG-100" ], skus.sort
  end

  test "shows an item" do
    get api_v1_item_path(items(:coffee)), as: :json

    assert_response :ok
    body = JSON.parse(response.body).fetch("item")
    assert_equal "CF-200", body.fetch("sku")
    assert_equal 1280, body.fetch("unit_price")
    assert_equal "active", body.fetch("status")
    assert_equal %w[id name sku status unit_price updated_at], body.keys.sort
  end

  test "returns 404 for a missing item" do
    get api_v1_item_path(0), as: :json

    assert_response :not_found
  end

  test "creates an item" do
    assert_difference("Item.count", 1) do
      post api_v1_items_path, params: {
        item: { sku: "TB-350", name: "紅茶 アッサム 350g", unit_price: 980, status: "active" }
      }, as: :json
    end

    assert_response :created
    assert_equal "TB-350", JSON.parse(response.body).dig("item", "sku")
  end

  test "rejects an invalid item" do
    assert_no_difference("Item.count") do
      post api_v1_items_path, params: {
        item: { sku: items(:coffee).sku, name: "", unit_price: -1, status: "draft" }
      }, as: :json
    end

    assert_response :unprocessable_entity
    errors = JSON.parse(response.body).fetch("errors")
    assert errors.key?("sku")
    assert errors.key?("name")
    assert errors.key?("unit_price")
    assert errors.key?("status")
  end

  test "updates an item" do
    patch api_v1_item_path(items(:coffee)), params: { item: { unit_price: 1400 } }, as: :json

    assert_response :ok
    assert_equal 1400, items(:coffee).reload.unit_price
    assert_equal 1400, JSON.parse(response.body).dig("item", "unit_price")
  end

  test "rejects an invalid update" do
    patch api_v1_item_path(items(:coffee)), params: { item: { sku: "" } }, as: :json

    assert_response :unprocessable_entity
    assert_equal "CF-200", items(:coffee).reload.sku
  end

  test "deletes an item" do
    assert_difference("Item.count", -1) do
      delete api_v1_item_path(items(:mug)), as: :json
    end

    assert_response :no_content
    assert_empty response.body
  end
end
