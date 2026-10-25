import type { Route } from "./+types/home";

const RAILS_ORIGIN = "http://127.0.0.1:3000";

type Item = {
  id: number;
  sku: string;
  name: string;
  unit_price: number;
  status: string;
  updated_at: string;
};

export function meta({}: Route.MetaArgs) {
  return [{ title: "Items" }];
}

export async function loader(_args: Route.LoaderArgs) {
  const response = await fetch(`${RAILS_ORIGIN}/api/v1/items`);

  if (!response.ok) {
    throw new Response("Rails items request failed", { status: response.status });
  }

  const body = (await response.json()) as { items: Item[] };
  return { items: body.items };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <main>
      <h1>Items</h1>
      <ul>
        {loaderData.items.map((item) => (
          <li key={item.id}>
            {item.sku} {item.name}
          </li>
        ))}
      </ul>
    </main>
  );
}
