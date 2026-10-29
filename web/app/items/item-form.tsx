import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { Form, Link } from "react-router";

import type { Item, ItemErrors, ItemInput } from "./api";

export function ItemForm({
  item,
  input,
  errors,
  submitLabel,
}: {
  item?: Pick<Item, "sku" | "name" | "unit_price" | "status">;
  input?: ItemInput;
  errors?: ItemErrors;
  submitLabel: string;
}) {
  return (
    <Form method="post">
      <Stack spacing={2}>
        <TextField
          name="sku"
          label="SKU"
          defaultValue={input?.sku ?? item?.sku ?? ""}
          error={Boolean(errors?.sku)}
          helperText={errors?.sku?.join(" ")}
          fullWidth
        />
        <TextField
          name="name"
          label="商品名"
          defaultValue={input?.name ?? item?.name ?? ""}
          error={Boolean(errors?.name)}
          helperText={errors?.name?.join(" ")}
          fullWidth
        />
        <TextField
          name="unit_price"
          label="単価"
          type="number"
          defaultValue={input?.unit_price ?? item?.unit_price ?? ""}
          error={Boolean(errors?.unit_price)}
          helperText={errors?.unit_price?.join(" ")}
          fullWidth
        />
        <TextField
          name="status"
          label="状態"
          select
          defaultValue={input?.status ?? item?.status ?? "active"}
          error={Boolean(errors?.status)}
          helperText={errors?.status?.join(" ")}
          slotProps={{ inputLabel: { shrink: true } }}
          fullWidth
        >
          <MenuItem value="active">active</MenuItem>
          <MenuItem value="archived">archived</MenuItem>
        </TextField>
        <Stack direction="row" spacing={1}>
          <Button type="submit" variant="contained">
            {submitLabel}
          </Button>
          <Button component={Link} to="/">
            一覧へ戻る
          </Button>
        </Stack>
      </Stack>
    </Form>
  );
}
