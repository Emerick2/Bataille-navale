import { Routes, Route } from 'react-router'
import './App.css'
import Layout from './Layouts/Layout/Layout'
import Home from './pages/Home/Home'
import Games from './pages/Games/Games'
import NewGame from './pages/NewGame/NewGame'
import History from './pages/History/History'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import NotFound from './pages/NotFound/NotFound'
import Credits from './pages/Credits/Credits'
import Game from './pages/Game/Game'

function App() {
  return (
      <Routes>
          <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/parties" element={<Games/>} />
              <Route path="/parties/nouvelle" element={<NewGame/>} />
              <Route path="/parties/:gameId" element={<Game />} />
              <Route path="/historique" element={<History/>} />
              <Route path="/connexion" element={<Login/>} />
              <Route path="/inscription" element={<Register/>} />
              <Route path="/credits" element={<Credits/>} />
          </Route>
        <Route path="*" element={<NotFound/>} />
      </Routes>
  )
}

export default App