import * as React from "react";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import Button from "@/components/ui/button/Button";

export default function CustomizedDialogs({
  open,
  setOpen,
  onClose,
  deleteMessage,
}: any) {

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        className: "rounded-2xl w-[380px] p-0 overflow-hidden",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-center relative border-b px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Confirmation
        </h2>

        <IconButton
          onClick={handleClose}
          className="!absolute right-3 top-3"
        >
          <CloseIcon className="text-gray-500" />
        </IconButton>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center text-center px-8 py-6 space-y-3">
        <WarningAmberRoundedIcon className="!text-yellow-500 !text-[42px]" />

        <p className="text-gray-600 text-sm leading-relaxed">
          {deleteMessage}
        </p>
      </div>

      {/* Footer */}
      <div className="flex justify-center gap-3 border-t px-6 py-4">
        <Button
          size="sm"
          onClick={handleClose}
          className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
        >
          Ok
        </Button>
      </div>
    </Dialog>
  );
}