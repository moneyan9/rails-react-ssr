require "test_helper"

class ItemTest < ActiveSupport::TestCase
  test "accepts an active item with a yen price" do
    item = Item.new(sku: "TB-350", name: "紅茶 アッサム 350g", unit_price: 980, status: "active")

    assert item.valid?
  end

  test "rejects a duplicate sku" do
    duplicate = items(:coffee).dup

    assert_not duplicate.valid?
    assert_includes duplicate.errors[:sku], "has already been taken"
  end

  test "rejects an unknown status" do
    item = items(:coffee).dup
    item.sku = "XX-1"
    item.status = "draft"

    assert_not item.valid?
    assert item.errors[:status].any?
  end

  test "rejects a negative price" do
    item = items(:coffee).dup
    item.sku = "XX-1"
    item.unit_price = -1

    assert_not item.valid?
    assert item.errors[:unit_price].any?
  end
end
