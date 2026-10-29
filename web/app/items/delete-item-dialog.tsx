import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import type { Item } from "./api";

export function DeleteItemDialog({
  itemToDelete,
  deleting,
  onCancel,
  onConfirm,
}: {
  itemToDelete: Item | null;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: (item: Item) => void;
}) {
  return (
    <Dialog
      open={itemToDelete !== null}
      onClose={() => {
        if (!deleting) onCancel();
      }}
    >
      <DialogTitle>商品を削除</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {itemToDelete ? `${itemToDelete.sku} ${itemToDelete.name} を削除します。` : ""}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={deleting}>
          キャンセル
        </Button>
        <Button
          color="error"
          variant="contained"
          disabled={itemToDelete === null || deleting}
          onClick={() => {
            if (!itemToDelete) return;
            onConfirm(itemToDelete);
          }}
        >
          削除
        </Button>
      </DialogActions>
    </Dialog>
  );
}
