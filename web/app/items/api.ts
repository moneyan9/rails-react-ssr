export const RAILS_ORIGIN = "http://127.0.0.1:3000";

export type Item = {
  id: number;
  sku: string;
  name: string;
  unit_price: number;
  status: string;
  updated_at: string;
};

export type ItemErrors = Partial<Record<"sku" | "name" | "unit_price" | "status", string[]>>;

export type ItemInput = {
  sku: string;
  name: string;
  unit_price: string;
  status: string;
};

export function itemInput(formData: FormData): ItemInput {
  return {
    sku: String(formData.get("sku") ?? ""),
    name: String(formData.get("name") ?? ""),
    unit_price: String(formData.get("unit_price") ?? ""),
    status: String(formData.get("status") ?? "active"),
  };
}

async function rails(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");

  return fetch(`${RAILS_ORIGIN}${path}`, { ...init, headers });
}

function ensureOk(response: Response) {
  if (!response.ok) {
    throw new Response("Rails items request failed", { status: response.status });
  }

  return response;
}

export async function readItems() {
  const response = ensureOk(await rails("/api/v1/items"));
  const body = (await response.json()) as { items: Item[] };
  return body.items;
}

export async function readItem(id: string) {
  const response = ensureOk(await rails(`/api/v1/items/${id}`));
  const body = (await response.json()) as { item: Item };
  return body.item;
}

export async function saveItem(path: string, method: "POST" | "PATCH", input: ItemInput) {
  const price = input.unit_price.trim();
  const response = await rails(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      item: {
        sku: input.sku,
        name: input.name,
        unit_price: price === "" ? null : Number(price),
        status: input.status,
      },
    }),
  });

  if (response.status === 422) {
    const body = (await response.json()) as { errors: ItemErrors };
    return { errors: body.errors, input };
  }

  ensureOk(response);
}

export async function deleteItem(id: string) {
  ensureOk(await rails(`/api/v1/items/${id}`, { method: "DELETE" }));
}
