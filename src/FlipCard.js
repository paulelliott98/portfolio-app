import React from "react";

export default function FlipCard({ classes, style, href, title, path, alt }) {
  return (
    <div className={"flip-card " + classes || ""} style={style}>
      <a
        className="logo-container"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <img className="logo" title={title} src={path} alt={alt} />
          </div>
          <div className="flip-card-back">
            <img className="logo" title={title} src={path} alt={alt} />
            <p className="mt-4">{title}</p>
          </div>
        </div>
      </a>
    </div>
  );
}
