import React, { useEffect, useReducer } from "react";
import Board from "./components/Board";
import {BOARD_SIZE, PLAYER_ONE, PLAYER_TWO } from "./config/const";
import useInterval from "./hooks/useInterval";
import sumCoordinates from "./utils/sumCoordinates";
import playerCanChangeToDirection from "./utils/playerCanChangeToDirection";
import "./App.css";

const initialState = [
  players,
  playableCells: 
];

function updateGame(players, action) {
  if (action.type === "move") {
    const newPlayers = players.map((player) => ({
      ...player,
      position: sumCoordinates(player.position, player.direction),
    }));
    return newPlayers;
  }
  if (action.type === "changeDirection") {
    console.log(players[0].keys);
    const newPlayers = players.map((player) => ({
      ...player,
      direction:
        player.keys[action.key] &&
        playerCanChangeToDirection(player.direction, player.keys[action.key])
          ? player.keys[action.key]
          : player.direction,
    }));
    return newPlayers;
  }
}

function App() {
  const [players, gameDispatch] = useReducer(updateGame, initialState);

  useInterval(function () {
    gameDispatch({ type: "move" });
  }, 1000);

  useEffect(function () {
    function handleKeyPress(event) {
      const key = `${event.keyCode}`;
      gameDispatch({ type: "changeDirection", key });
    }

    document.addEventListener("keydown", handleKeyPress);

    return function cleanUp() {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return <Board players={players} />;
}

export default App;
