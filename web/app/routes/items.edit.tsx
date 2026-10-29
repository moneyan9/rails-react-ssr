import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { redirect } from "react-router";

import { itemInput, readItem, saveItem } from "../items/api";
import { ItemForm } from "../items/item-form";
import type { Route } from "./+types/items.edit";

export function meta({}: Route.MetaArgs) {
  return [{ title: "商品を編集" }];
}

export async function loader({ params }: Route.LoaderArgs) {
  return { item: await readItem(params.id) };
}

export async function action({ params, request }: Route.ActionArgs) {
  const validationError = await saveItem(
    `/api/v1/items/${params.id}`,
    "PATCH",
    itemInput(await request.formData()),
  );

  if (validationError) return validationError;

  return redirect("/");
}

export default function EditItem({ loaderData, actionData }: Route.ComponentProps) {
  return (
    <Container component="main" maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        商品を編集
      </Typography>
      <ItemForm
        item={loaderData.item}
        input={actionData?.input}
        errors={actionData?.errors}
        submitLabel="更新"
      />
    </Container>
  );
}
