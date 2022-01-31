import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import "./Spinner.css";

export default function Spinner({ color }) {
    return (
        <div className="spinner" style={{ color }}>
            <FontAwesomeIcon icon={faSpinner} spin />
        </div>
    )
}