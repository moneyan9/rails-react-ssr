import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { Link } from "react-router";

import { readItems } from "../items/api";
import type { Route } from "./+types/home";

const yen = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
});

export function meta({}: Route.MetaArgs) {
  return [{ title: "Items" }];
}

export async function loader(_args: Route.LoaderArgs) {
  return { items: await readItems() };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <Container component="main" maxWidth="md" sx={{ py: 4 }}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4" component="h1">
          Items
        </Typography>
        <Button component={Link} to="/items/new" variant="contained">
          新規
        </Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SKU</TableCell>
              <TableCell>商品名</TableCell>
              <TableCell align="right">単価</TableCell>
              <TableCell>状態</TableCell>
              <TableCell align="right">操作</TableCell>
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
                <TableCell align="right">
                  <Button component={Link} to={`/items/${item.id}/edit`} size="small">
                    編集
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
