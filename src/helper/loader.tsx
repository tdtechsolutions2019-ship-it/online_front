"use client";
import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';
type LoaderProps = {
  size?: number | string;
  color?: "inherit" | "primary" | "secondary";
};
const Loader: React.FC<LoaderProps> = ({ size = 40, color = "inherit" }) => {
  return (
    <div>
        <CircularProgress color={color ? color : "inherit"} disableShrink size={size  ? size : 40} />
    </div>
  )
}

export default Loader
