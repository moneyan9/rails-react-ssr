import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { redirect } from "react-router";

import { itemInput, saveItem } from "../items/api";
import { ItemForm } from "../items/item-form";
import type { Route } from "./+types/items.new";

export function meta({}: Route.MetaArgs) {
  return [{ title: "新規商品" }];
}

export async function action({ request }: Route.ActionArgs) {
  const result = await saveItem("/api/v1/items", "POST", itemInput(await request.formData()));

  if (result) return result;

  return redirect("/");
}

export default function NewItem({ actionData }: Route.ComponentProps) {
  return (
    <Container component="main" maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        新規商品
      </Typography>
      <ItemForm
        values={actionData?.values}
        errors={actionData?.errors}
        submitLabel="作成"
      />
    </Container>
  );
}
