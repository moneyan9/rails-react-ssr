class CreateItems < ActiveRecord::Migration[8.1]
  def change
    create_table :items do |t|
      t.string :sku, null: false
      t.string :name, null: false
      t.integer :unit_price, null: false
      t.string :status, null: false, default: "active"

      t.timestamps
    end
    add_index :items, :sku, unique: true
  end
end
