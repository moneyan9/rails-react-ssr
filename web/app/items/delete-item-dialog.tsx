import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import type { Item } from "./api";

export function DeleteItemDialog({
  item,
  deleting,
  onCancel,
  onConfirm,
}: {
  item: Item | null;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: (item: Item) => void;
}) {
  return (
    <Dialog
      open={item !== null}
      onClose={() => {
        if (!deleting) onCancel();
      }}
    >
      <DialogTitle>商品を削除</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {item ? `${item.sku} ${item.name} を削除します。` : ""}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={deleting}>
          キャンセル
        </Button>
        <Button
          color="error"
          variant="contained"
          disabled={item === null || deleting}
          onClick={() => {
            if (!item) return;
            onConfirm(item);
          }}
        >
          削除
        </Button>
      </DialogActions>
    </Dialog>
  );
}
