import { faQuoteLeft, faQuoteRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import React from "react";
import "./Story.css";
export default function Story({ children, story }) {
    return (
        <div className="story-container">
            <section className="story">
                <FontAwesomeIcon className="quote" icon={faQuoteLeft} />
                {story.message}
                <FontAwesomeIcon className="quote" icon={faQuoteRight} />
            </section>

            <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "row" }}>
                <span style={{ paddingTop: "2px" }}> - Anonymous</span>
                <span className="timestamp">At {moment(story.timestamp).format("hh:mm A MM/DD/yyyy")}</span>
            </div>
        </div>
    )
}