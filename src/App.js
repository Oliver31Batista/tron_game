import React, { useEffect, useReducer } from "react";
import Board from "./components/Board";
import {
  UNIT,
  BOARD_SIZE,
  PLAYER_ONE,
  PLAYER_TWO,
  GAME_READY,
  GAME_PLAYING,
  GAME_ENDED,
} from "./config/const";
import useInterval from "./hooks/useInterval";
import sumCoordinates from "./utils/sumCoordinates";
import playerCanChangeToDirection from "./utils/playerCanChangeToDirection";
import "./App.css";
import getPlayableCells from "./utils/getPlayableCells";
import getCellKey from "./utils/getCellKey";
import Start from "./components/Start";
import Result from "./components/Result";

const players = [PLAYER_ONE, PLAYER_TWO];

const initialState = {
  players,
  playableCells: getPlayableCells(
    BOARD_SIZE,
    UNIT,
    players.map((player) => getCellKey(player.position.x, player.position.y))
  ),
  gameStatus: GAME_READY,
};

function updateGame(game, action) {
  if (action.type === "start") {
    return { ...initialState, gameStatus: GAME_PLAYING };
  }

  if (action.type === "restart") {
    return { ...initialState, gameStatus: GAME_READY };
  }
  if (action.type === "move") {
    const newPlayers = game.players.map((player) => ({
      ...player,
      position: sumCoordinates(player.position, player.direction),
    }));

    const newPlayersWithCollisions = newPlayers.map((player) => {
      const myCellKey = getCellKey(player.position.x, player.position.y);
      return {
        ...player,
        hasDied:
          !game.playableCells.includes(myCellKey) ||
          newPlayers
            .filter((p) => p.id !== player.id)
            .map((p) => getCellKey(p.position.x, p.position.y))
            .includes(myCellKey),
      };
    });

    const newOcupiedCells = game.players.map((player) =>
      getCellKey(player.position.x, player.position.y)
    );

    const playableCells = game.playableCells.filter((playableCell) => {
      return !newOcupiedCells.includes(playableCell);
    });

    return {
      players: newPlayersWithCollisions,
      playableCells: playableCells,
      gameStatus:
        newPlayersWithCollisions.filter((player) => player.hasDied).length === 0
          ? GAME_PLAYING
          : GAME_ENDED,
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
      playableCells: game.playableCells,
      gameStatus: game.gameStatus,
    };
  }
}

function App() {
  let result = null;

  const [game, gameDispatch] = useReducer(updateGame, initialState);

  const players = game.players;
  const diedPlayers = players.filter((player) => player.hasDied);

  if (diedPlayers.length > 0) {
    console.log(diedPlayers);
  }

  useInterval(
    function () {
      gameDispatch({ type: "move" });
    },
    game.gameStatus !== GAME_PLAYING ? null : 100
  );

  useEffect(function () {
    function handleKeyPress(event) {
      const key = `${event.keyCode}`;
      if (key === "13") {
        if (game.gameStatus === GAME_READY) {
          handleStart();
        }
        if (game.gameStatus === GAME_ENDED) {
          handleRestart();
        }
      }
      gameDispatch({ type: "changeDirection", key });
    }

    document.addEventListener("keydown", handleKeyPress);

    return function cleanUp() {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  function handleStart() {
    gameDispatch({ type: "start" });
  }

  function handleRestart() {
    gameDispatch({ type: "restart" });
  }

  if (game.gameStatus === GAME_ENDED) {
    const winningPlayers = game.players.filter((player) => !player.hasDied);
    if (winningPlayers.length === 0) {
      result = "Empate";
    } else {
      result = `Ganador: ${winningPlayers
        .map((player) => `Jugador ${player.id}`)
        .join(",")}`;
    }
  }

  return (
    <>
      <Board players={game.players} gameStatus={game.gameStatus} />
      {game.gameStatus === GAME_READY && <Start onClick={handleStart} />}
      {game.gameStatus === GAME_ENDED && (
        <Result onClick={handleRestart} result={result} />
      )}
    </>
  );
}

export default App;
