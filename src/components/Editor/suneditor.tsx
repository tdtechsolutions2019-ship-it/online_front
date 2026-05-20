"use client";

import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css";
import katex from "katex";

const SunEditor = dynamic(() => import("suneditor-react"), {
    ssr: false,
});

export default function Editor({ value, onChange, disabled }) {
    return (
        <SunEditor
            setContents={value ?? ""}
            onChange={onChange}
            disable={disabled ?? false}
            setOptions={{
                katex: katex,
                buttonList: [
                    ["undo", "redo"],
                    ["bold", "italic", "underline"],
                    ["list", "align"],
                    ["link", "image"],
                    ["fullScreen"],
                    ["formatBlock"],
                    ["removeFormat"],
                    ["math"],
                    ["subscript", "superscript"],
                ],
            }}
            height="100%"
            width="90%"
        />
    );
}