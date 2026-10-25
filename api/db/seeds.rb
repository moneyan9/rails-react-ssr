# Idempotent sample catalog for local development.
[
  { sku: "CF-200", name: "オーガニックコーヒー 200g", unit_price: 1280, status: "active" },
  { sku: "TB-350", name: "紅茶 アッサム 350g", unit_price: 980, status: "active" },
  { sku: "MG-100", name: "マグカップ 白", unit_price: 1600, status: "archived" }
].each do |attrs|
  Item.find_or_create_by!(sku: attrs[:sku]) do |item|
    item.assign_attributes(attrs)
  end
end
