import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

import type { Route } from "./+types/home";

const RAILS_ORIGIN = "http://127.0.0.1:3000";

const yen = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
});

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
    <Container component="main" maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Items
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SKU</TableCell>
              <TableCell>商品名</TableCell>
              <TableCell align="right">単価</TableCell>
              <TableCell>状態</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loaderData.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell align="right">{yen.format(item.unit_price)}</TableCell>
                <TableCell>
                  <Chip
                    label={item.status}
                    size="small"
                    color={item.status === "active" ? "success" : "default"}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
