import './History.css'

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
    NameOne : string;
    NameTwo : string;
    Status : string;
    CreatedAt : string;
}


const History = () => {
    const listOfOngoingGames : HistoryBloc[] = []
    const listOfPendingGames : HistoryBloc[] = []
    const listOfCompletedGames : HistoryBloc[] = []
    let gamesWin : number = 0
    let totalGames : number = 0
    let winPercentage : number = 0

    return (
        <>
            <h1>Historique des parties</h1>
            <p>{winPercentage}% de parties gagner</p>
            <p>{gamesWin}/{totalGames} de parties gagner</p>
            
            {listOfPendingGames.length > 0 ?
                <>
                    <h2>Les parties en cours</h2>
                    {listOfPendingGames.map((e) => (
                        <article className="aHistory">
                            <div className='listeOfName'>
                                <p className='nameOne'>{e.NameOne}</p>
                                <p className='nameTwo'>{e.NameTwo}</p>
                            </div>
                            <p className='status'>État : {e.Status}</p>
                            <p className='createdAt'>Début : {e.CreatedAt}</p>
                        </article>
                    ))}
                </>
            : null}

            {listOfOngoingGames.length > 0 ?
                <>
                    <h2>Les parties en attente de l'autre joueur</h2>
                    {listOfOngoingGames.map((e) => (
                        <article className="aHistory">
                            <div className='listeOfName'>
                                <p className='nameOne'>{e.NameOne}</p>
                                <p className='nameTwo'>{e.NameTwo}</p>
                            </div>
                            <p className='status'>État : {e.Status}</p>
                            <p className='createdAt'>Début : {e.CreatedAt}</p>
                        </article>
                    ))}
                </>
            : null }
            
            {listOfCompletedGames.length > 0 ?
                <>
                    <h2>Les parties terminés</h2>
                    {listOfCompletedGames.map((e) => (
                        <article className="aHistory">
                            <div className='listeOfName'>
                                <p className='nameOne'>{e.NameOne}</p>
                                <p className='nameTwo'>{e.NameTwo}</p>
                            </div>
                            <p className='status'>État : {e.Status}</p>
                            <p className='createdAt'>Début : {e.CreatedAt}</p>
                        </article>
                    ))}
                </>
            : null }
        </>
    )
}

export default History