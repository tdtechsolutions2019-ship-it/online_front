import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import Button from "@/components/ui/button/Button";

export default function ResponsiveDialog({
  open,
  setOpen,
  handleDelete,
}: any) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      PaperProps={{
        className: "rounded-2xl max-w-[420px] w-full p-2"
      }}
    >
      {/* Title */}
      <DialogTitle className="text-center pb-0">
        <div className="flex flex-col items-center gap-2">
          <WarningAmberRoundedIcon className="!text-red-500 !text-[40px]" />
          <h2 className="text-lg font-semibold text-gray-800">
            Confirm Delete
          </h2>
        </div>
      </DialogTitle>

      {/* Content */}
      <DialogContent className="text-center pt-2">
        <p className="text-sm text-gray-600">
          Are you sure you want to delete this item? This action cannot be undone.
        </p>
      </DialogContent>

      {/* Actions */}
      <DialogActions className="flex justify-center gap-3 pb-4" style={{display:"flex", justifyContent:"center"}}>
        <Button
        size="sm"
          variant="outline"
          onClick={handleClose}
          className="!rounded-lg !normal-case !px-4"
        >
          Cancel
        </Button>

        <Button
          size="sm"
          variant="primary"
          onClick={() => {
            handleDelete();
            handleClose();
          }}
          className="!rounded-lg !normal-case !px-4 !shadow-none bg-red-700 hover:bg-red-600"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}