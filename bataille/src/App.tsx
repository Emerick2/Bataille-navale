import { Routes, Route } from 'react-router'
import './App.css'
import Layout from './Layouts/Layout/Layout'
import Home from './pages/Home/Home'
import Games from './pages/Games/Games'
import NewGame from './pages/NewGame/NewGame'
import Game from './pages/Game/Game'
import History from './pages/History/History'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import NotFound from './pages/NotFound/NotFound'
import { useState, useEffect } from 'react';

interface GameData{
  id: number;
  creatorId: number;
  minPlayers: number;
  maxPlayers: number;
  status: "pending" | "started" | "ended";
  players: Object;
  currentTurnUserId: number;
  isYourTurn: boolean;
  state: string;
  endData: Object;
  createdAt: string;
  startedAt: Object;
  endedAt: Object;
}

interface PlayerHeaders{
  Authorization : string;
}

interface Player{
  player : GameData;
  playerHeaders : PlayerHeaders;
}




const TestAPI = async () => {
  const apiUrl = 'http://localhost:8000'
  const password = 'hunter2'
  const playerOneEmail = `test-joueur-1-${Date.now()}@example.com`
  const playerTwoEmail = `test-joueur-2-${Date.now()}@example.com`

  const request = async (path: string, options: RequestInit = {}) => {
    const response = await fetch(`${apiUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`${options.method ?? 'GET'} ${path}: ${response.status} ${await response.text()}`)
    }

    return response.json()
  }

  try {
    const signup = (email: string) => request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    const playerOne = await signup(playerOneEmail)
    const playerTwo = await signup(playerTwoEmail)
    const playerOneHeaders = { Authorization: `Bearer ${playerOne.token}` }
    const playerTwoHeaders = { Authorization: `Bearer ${playerTwo.token}` }

    const game = await request('/games', {
      method: 'POST',
      headers: playerOneHeaders,
      body: JSON.stringify({ minPlayers: 2, maxPlayers: 2 }),
    })

    await request(`/games/${game.id}/invite`, {
      method: 'POST',
      headers: playerOneHeaders,
      body: JSON.stringify({ email: playerTwoEmail }),
    })

    const board = [[0, 0], [1, 1]]
    const serializedBoard = JSON.stringify(board)
    await request(`/games/${game.id}/start`, {
      method: 'POST',
      headers: playerOneHeaders,
      body: JSON.stringify({
        state: serializedBoard,
        currentTurnUserId: playerOne.user.id,
      }),
    })

    const boardReadByPlayerOne = await request(`/games/${game.id}`, {
      headers: playerOneHeaders,
    })
    console.log('Tableau lu par le joueur 1 :', JSON.parse(boardReadByPlayerOne.state))

    await request(`/games/${game.id}/state`, {
      method: 'PUT',
      headers: playerOneHeaders,
      body: JSON.stringify({
        state: serializedBoard,
        currentTurnUserId: playerTwo.user.id,
      }),
    })

    const boardReadByPlayerTwo = await request(`/games/${game.id}`, {
      headers: playerTwoHeaders,
    })
    console.log('Tableau lu par le joueur 2 :', JSON.parse(boardReadByPlayerTwo.state))

    await request(`/games/${game.id}/state`, {
      method: 'PUT',
      headers: playerTwoHeaders,
      body: JSON.stringify({
        state: serializedBoard,
        currentTurnUserId: playerOne.user.id,
      }),
    })

    const finalGame = await request(`/games/${game.id}`, {
      headers: playerOneHeaders,
    })
    console.log('Tableau final lu par le joueur 1 :', JSON.parse(finalGame.state));

    const player : Player = {player:playerOne, playerHeaders : playerOneHeaders};
    return player
  } catch (error) {
    console.error('Test de l API impossible :', error)
  }

  return null
}

function App() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isActive = true;
    TestAPI()
      .then((result) => {
        if (isActive) {
          setPlayer(result);
        }
      })
      .catch((error) => {
        console.error('Échec du chargement des données du joueur :', error);
      })
      .finally(() => {
        if (isActive) {
          setLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  if (loading) {
    return <div>Chargement de l'API en cours...</div>;
  }


  return (
    <Routes>
        <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/parties" element={<Games/>} />
            <Route path="/parties/nouvelle" element={<NewGame/>} />
            <Route path="/parties/:id" element={<Game/>} />
            <Route path="/historique" element={<History/>} />
            <Route path="/connexion" element={<Login/>} />
            <Route path="/inscription" element={<Register/>} />
        </Route>
        <Route path="*" element={<NotFound/>} />
    </Routes>
  )
}

export default App