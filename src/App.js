import React, { useEffect, useReducer } from "react";
import Board from "./components/Board";
import {UNIT, BOARD_SIZE, PLAYER_ONE, PLAYER_TWO } from "./config/const";
import useInterval from "./hooks/useInterval";
import sumCoordinates from "./utils/sumCoordinates";
import playerCanChangeToDirection from "./utils/playerCanChangeToDirection";
import "./App.css";
import getPlayableCells from "./utils/getPlayableCells";
import getCellKey from "./utils/getCellKey";

const players = [PLAYER_ONE, PLAYER_TWO];

const initialState = {
  players,
  playableCells: getPlayableCells(
    BOARD_SIZE, 
    UNIT, 
    players.map(player => getCellKey(player.position.x, player.position.y))
  )
  };

function updateGame(game, action) {
  if (action.type === "move") {
    const newPlayers = game.players.map((player) => ({
      ...player,
      position: sumCoordinates(player.position, player.direction),
    }));
    return {
      players: newPlayers,
      playableCells: game.playableCells
    };
  }
  if (action.type === "changeDirection") {
    console.log(players[0].keys);
    const newPlayers = game.players.map((player) => ({
      ...player,
      direction:
        player.keys[action.key] &&
        playerCanChangeToDirection(player.direction, player.keys[action.key])
          ? player.keys[action.key]
          : player.direction,
    }));
    return {
      players: newPlayers,
      playableCells: game.playableCells
    };
  }
}

function App() {
  const [game, gameDispatch] = useReducer(updateGame, initialState);

  useInterval(function () {
    gameDispatch({ type: "move" });
  }, 500);

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

  return <Board players={game.players} />;
}

export default App;
