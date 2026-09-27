import {useContext, useState} from 'react';
import {GameInProgressPlayer, HistoryPlayer} from '../../GridFunctionality/DataPlayerAPI';
import './History.css'
import {PlayerContext, type GameData, type Player} from '../../context/PlayerContext';

export interface HistoryBloc{
    nameOne : string;
    nameTwo : string;
    status : string;
    createdAt : string;
    idGame : number;
}

interface ListOfHistoryBloc{
    listOfOngoingGames : HistoryBloc[];
    listOfPendingGames : HistoryBloc[];
    listOfCompletedGames : HistoryBloc[];
    gamesWin : number;
    totalGames : number;
    winPercentage : number;
}


const LoadHistory = async (player : Player, setLoading : (loading : boolean) => void, setListOfHistoryBloc : (listOfHistoryBloc : ListOfHistoryBloc) => void) => {
    const listOfHistoryBloc : ListOfHistoryBloc = { listOfOngoingGames : [], listOfPendingGames : [], listOfCompletedGames : [], gamesWin : 0, totalGames : 0, winPercentage : 0, };
    const history : GameData[] = await HistoryPlayer(player.playerHeaders);
    const gameInProgress : GameData[] = await GameInProgressPlayer(player.playerHeaders);
    for (let i = 0; i < gameInProgress.length; i++) {
        history.push(gameInProgress[i]);
    }

    let winsCount = 0;
    let completedCount = 0;

    for (let i = 0; i < history.length; i++) {
        const game = history[i];
        const creator = game.players.find((player) => player.id === game.creatorId);
        const opponent = game.players.find((player) => player.id !== game.creatorId);

        let textStatus : string = game.status;
        if (game.status === "ended") {
            listOfHistoryBloc.totalGames++;
            completedCount++;

            let hasWin = false;
            if (game.endData) {
                try {
                    const endDataParsed = JSON.parse(game.endData);
                    const isPlayerOne = game.creatorId === player.userId;
                    hasWin = (isPlayerOne && endDataParsed.playerOneVictory) || (!isPlayerOne && !endDataParsed.playerOneVictory);
                } catch (e) {
                    console.error("Erreur de lecture de endData", e);
                }
            }

            if (hasWin) {
                winsCount++;
                textStatus = "Gagnée";
            } else {
                textStatus = "Perdue";
            }
        } else {
            if (game.status === "pending") {
                textStatus = "En attente";
            } else if (game.status === "started") {
                textStatus = "En cours";
            }
            listOfHistoryBloc.totalGames++;
        }

        const newObject: HistoryBloc = {
            nameOne: creator?.email ?? "Joueur inconnu",
            nameTwo: opponent?.email ?? "En attente d'un joueur",
            status: textStatus,
            createdAt: game.createdAt,
            idGame: game.id
        };
        if (game.status === "pending"){
            listOfHistoryBloc.listOfPendingGames.push(newObject);
        } else if (game.status === "started"){
            listOfHistoryBloc.listOfOngoingGames.push(newObject);
        } else {
            listOfHistoryBloc.listOfCompletedGames.push(newObject);
        }
        
        listOfHistoryBloc.totalGames++;
    }

    listOfHistoryBloc.gamesWin = winsCount;
    if (completedCount > 0) {
        listOfHistoryBloc.winPercentage = Math.round((winsCount / completedCount) * 100);
    }

    setListOfHistoryBloc(listOfHistoryBloc);
    setLoading(false);
}

const History = () => {
    const { player } = useContext(PlayerContext);
    const [loading, setLoading] = useState(true);
    const [listOfHistoryBloc, setListOfHistoryBloc] = useState<ListOfHistoryBloc>({ listOfOngoingGames : [], listOfPendingGames : [], listOfCompletedGames : [], gamesWin : 0, totalGames : 0, winPercentage : 0, })
    if (player == null) return <h1>Vous n’êtes pas connecté.</h1>

    if (loading){
        LoadHistory(player, setLoading, setListOfHistoryBloc);
    }

    return (
        <>
            <h1>Historique des parties</h1>
            {loading ? <h2>Chargement en cours...</h2> : null}
            <p>{listOfHistoryBloc.winPercentage}% de parties gagner</p>
            <p>{listOfHistoryBloc.gamesWin}/{listOfHistoryBloc.totalGames} de parties gagner</p>
            
            {listOfHistoryBloc.listOfPendingGames.length > 0 ?
                <>
                    <h2>Les parties en cours</h2>
                    {listOfHistoryBloc.listOfPendingGames.map((e) => (
                        <article className="aHistory" key={crypto.randomUUID()}>
                            <div className='listeOfName'>
                                <p className='nameOne'>{e.nameOne}</p>
                                <p className='nameTwo'>{e.nameTwo}</p>
                            </div>
                            <p className='status'>État : {e.status}</p>
                            <p className='createdAt'>Début : {e.createdAt}</p>
                        </article>
                    ))}
                </>
            : null}

            {listOfHistoryBloc.listOfOngoingGames.length > 0 ?
                <>
                    <h2>Les parties en attente de l'autre joueur</h2>
                    {listOfHistoryBloc.listOfOngoingGames.map((e) => (
                        <article className="aHistory" key={crypto.randomUUID()}>
                            <div className='listeOfName'>
                                <p className='nameOne'>{e.nameOne}</p>
                                <p className='nameTwo'>{e.nameTwo}</p>
                            </div>
                            <p className='status'>État : {e.status}</p>
                            <p className='createdAt'>Début : {e.createdAt}</p>
                        </article>
                    ))}
                </>
            : null }
            
            {listOfHistoryBloc.listOfCompletedGames.length > 0 ?
                <>
                    <h2>Les parties terminés</h2>
                    {listOfHistoryBloc.listOfCompletedGames.map((e) => (
                        <article className="aHistory" key={crypto.randomUUID()}>
                            <div className='listeOfName'>
                                <p className='nameOne'>{e.nameOne}</p>
                                <p className='nameTwo'>{e.nameTwo}</p>
                            </div>
                            <p className='status'>État : {e.status}</p>
                            <p className='createdAt'>Début : {e.createdAt}</p>
                        </article>
                    ))}
                </>
            : null }
        </>
    )
}

export default History