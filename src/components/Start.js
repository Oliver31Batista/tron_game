import React from "react";
import Button from "./Button";
import "../css/Start.css"

export default function Start({ onClick }) {
  return (
    <div className="play-info">
      <div className="title-container">
        <div className="neon-title">Tron</div>
        <div className="neon-subtitle">Legacy</div>
      </div>
      <Button onClick={onClick}>Comenzar</Button>
    </div>
  );
}
