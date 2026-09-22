import {useContext, useEffect, useState} from 'react';
import {GameInProgressPlayer, HistoryPlayer} from '../../GridFunctionality/DataPlayerAPI';
import './History.css'
import {PlayerContext, type GameData, type Player} from '../../context/PlayerContext';

/*
Consigne :
Consulter la liste des dernières parties et de leurs résultats
sur une page d'historique spécifique à chaque joueur.

- état de la partie : invitation envoyer / invitation reçus / en cours / terminé
- date de début de la partie : "2026-09-14 12:00:00"
- Nom du joueur qui à créé la partie
- Nom du joueur qui à été invitée
- Si le joueur à gagner la partie

- pourcentage de partie gagner
- nombre de partie gagner / nombre partie jouer
*/
interface HistoryBloc{
    nameOne : string;
    nameTwo : string;
    status : string;
    createdAt : string;
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

    for (let i = 0; i < history.length; i++) {
        // console.log(history[0].createdAt);
        const newObject : HistoryBloc = {
            nameOne : history[0].creatorId.toString(),
            // nameTwo : history[0].players.id.toString(),
            nameTwo : "Nom2",
            status : history[0].status, // revenir ici pour mettre la bonne valeur.
            createdAt : history[0].createdAt,
        };
        if (history[0].status == "pending"){
            listOfHistoryBloc.listOfPendingGames.push(newObject);
        } else if (history[0].status == "started"){
            listOfHistoryBloc.listOfOngoingGames.push(newObject);
        } else {
            listOfHistoryBloc.listOfCompletedGames.push(newObject);
        }
        
        listOfHistoryBloc.totalGames++;
        // newObject.status = ""
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