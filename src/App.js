import { useReducer } from 'react';
import './App.css';
import Board from './components/Board';
import { PLAYER_ONE, PLAYER_TWO } from './config/const';
import useInterval from './hooks/useInterval';

const initialState = [
  PLAYER_ONE, PLAYER_TWO
]

function updateGame(state, action){
  if(action.type === 'move'){
    console.log('toca mover')
    return state;
  }
}

function App() {

  const [players, gameDispatch] = useReducer(updateGame, initialState)

  useInterval(function(){
    gameDispatch({type: 'move'});

  }, 100)

  return (
    <Board players={players} />
  );
}

export default App;
