class Item < ApplicationRecord
  enum :status, { active: "active", archived: "archived" }, default: :active, validate: true

  validates :sku, presence: true, uniqueness: true
  validates :name, presence: true
  validates :unit_price, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
end
