module Api
  module V1
    class ItemsController < ApplicationController
      before_action :set_item, only: %i[show update destroy]

      def index
        items = Item.order(updated_at: :desc, id: :desc)
        render json: { items: items.map { |item| item_attributes(item) } }
      end

      def show
        render json: { item: item_attributes(@item) }
      end

      def create
        item = Item.new(item_params)
        if item.save
          render json: { item: item_attributes(item) }, status: :created
        else
          render json: { errors: item.errors }, status: :unprocessable_entity
        end
      end

      def update
        if @item.update(item_params)
          render json: { item: item_attributes(@item) }
        else
          render json: { errors: @item.errors }, status: :unprocessable_entity
        end
      end

      def destroy
        @item.destroy!
        head :no_content
      end

      private
        def set_item
          @item = Item.find(params[:id])
        end

        def item_params
          params.require(:item).permit(:sku, :name, :unit_price, :status)
        end

        def item_attributes(item)
          item.as_json(only: %i[id sku name unit_price status updated_at])
        end
    end
  end
end
