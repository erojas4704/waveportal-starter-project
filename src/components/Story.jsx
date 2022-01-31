import { faQuoteLeft, faQuoteRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import "./Story.css";
export default function Story({ children }) {
    return (
        <div className="story-container">
            <section className="story">
                <FontAwesomeIcon className="quote" icon={faQuoteLeft} />
                {children}
                <FontAwesomeIcon className="quote" icon={faQuoteRight} />
            </section>

            <span style={{paddingTop: "2px"}}> - Anonymous</span>
        </div>
    )
}