"use client";
import React from "react";
import {

  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Button from "../button/Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  isFullscreen?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className = "",
  showCloseButton = true,
  isFullscreen = false,
}) => {
  const theme = useTheme();

  // Auto fullscreen on mobile OR manual override
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const fullScreen = isFullscreen || isMobile;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullScreen={fullScreen}
      
      fullWidth
      maxWidth="sm"
      scroll="body"
      BackdropProps={{
        sx: {
          // backdropFilter: "blur(12px)",
          backgroundColor: "rgba(156, 163, 175, 0.5)",
        },
      }}
      PaperProps={{
       className: "rounded-2xl max-w-[420px] w-full p-2", 
        sx: {
          borderRadius: fullScreen ? 0 : "24px", // matches rounded-3xl
          position: "relative",
        },
      }}
    >
      

      {/* Content */}
      <DialogContent
        sx={{
          padding: 3,
        }}
      >
        {children}
      </DialogContent>
      
    </Dialog>
  );
};