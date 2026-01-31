import React from "react";
import "./ScanLoader.css";
export default function ScanLoader({text, font = "50px"}) {
    return (
        <p className="loader" style={{ fontSize: font }}><span>{text}</span></p>
    );
}