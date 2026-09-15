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

const TestAPI = async () => {
  try {
    // se créé un compte :
    // console.log("Création du compte :");
    // const reponse = await fetch("http://localhost:8000/auth/signup", {
    //   method: "POST",
    //   body: JSON.stringify({ "email": "a@b.com", "password": "hunter2", "profilePicture": "data:image/png;base64,..." }),
    // });
    // console.log(reponse);


    
    // se connecter au compte :
    console.log("Connexion :");
    const reponse2 = await fetch("http://localhost:8000/auth/login", {
      method: "POST",
      body: JSON.stringify({ "email": "a@b.com", "password": "hunter2" }),
    });
    console.log(reponse2);
    
    // // se créé une partie :
    // console.log("Création de la partie :");
    // const reponse3 = await fetch("http://localhost:8000/games", {
    //   method: "POST",
    //   body: JSON.stringify({ "minPlayers": 1, "maxPlayers": 1 }),
    // });
    // console.log(reponse3);
    
    // // lancer la partie :
    // console.log("Lancement de la partie :");
    // const reponse4 = await fetch("http://localhost:8000/games", {
    //   method: "POST",
    //   body: JSON.stringify({ "state": "{...état initial...}", "currentTurnUserId": 1 }),
    // });
    // console.log(reponse4);
    
    const reponse4 = await fetch("http://localhost:8000/games/mine");
    console.log(reponse4)


    // const reponse5 = await fetch("http://localhost:8000/games/mine");
    // console.log(reponse5)

    // const textObject = "{'bonjour':3, 'nom':'oui'}"
    // console.log()

    // séréalisation :
    // const myEntity : number[][] | undefined = [[0,0,0], [1,0,1]]
    // const jsonEntity: string = JSON.stringify(myEntity);
    // const entity: number[][] = JSON.parse(jsonEntity);
    // console.log(entity)


  } catch(e) {
    console.log(e)
  }
} 

function App() {
  TestAPI()

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