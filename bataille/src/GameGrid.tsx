import './GameGrid.css'
import React, {useContext, useEffect, useState} from 'react';
import {ConnexionALaPartie, EndedGame, ItIsPlayerOneTurn, TheCurrentPlayerIsPlayerOne, WritePartOfTheGame} from './GridFunctionality/ReadingAndWritingTheAPIGrid';
import {PlayerContext, type Player} from './context/PlayerContext';

export const numberOfBoat : number = 9;

export interface TheGameGrids{
    GameGridPlayer1 : number[][]; // La grille avec les bateau J1
    GameGridPlayer2 : number[][]; // La grille avec les bateau J2
    PlayGameGridPlayer1 : number[][]; // La grille avec les tentatives J1
    PlayGameGridPlayer2 : number[][]; // La grille avec les tentatives J2
}

export const height : number = 10;

function getGameGrids(player: Player | null): TheGameGrids | null {
    if (!player || !player.player || typeof player.player.id !== 'number' || typeof player.player.state !== 'string' || player.player.state.length === 0) {
        return null;
    }

    if (typeof player.player.state !== 'string' || player.player.state.length === 0) {
        return null;
    }
    
    try {
        const gameGrids = JSON.parse(player.player.state) as TheGameGrids;
        if (!Array.isArray(gameGrids.GameGridPlayer1) || !Array.isArray(gameGrids.GameGridPlayer2) ||
            !Array.isArray(gameGrids.PlayGameGridPlayer1) || !Array.isArray(gameGrids.PlayGameGridPlayer2)) {
            return null;
        }
        return gameGrids;
    } catch {
        return null;
    }
}

function MyGameGrid() {
    const { player } = useContext(PlayerContext);
    const theGameGrids = getGameGrids(player);
    if (theGameGrids && player){
        let gridBoat : number[][] = theGameGrids.GameGridPlayer1;
        if (TheCurrentPlayerIsPlayerOne(player) == false){
            gridBoat = theGameGrids.GameGridPlayer2;
        }

        return (
            gridBoat.map((column) => (
                <React.Fragment key={crypto.randomUUID()}>
                    <div className="lineCase">
                        {column.map((line, lineIndex) => (
                            line == 0 ? <article key={crypto.randomUUID()} className="caseGameGride"></article> : <article key={lineIndex} className="caseGameGride boat"></article>
                        ))}
                    </div>
                </React.Fragment>
            ))
        );
    }
    return <p>Chargement en cours.</p>;
}

function GameGridPlay() {
    const { player, setPlayer } = useContext(PlayerContext);
    const [itIsOurTurn, setItIsOurTurn] = useState<boolean>(false);

    useEffect(() => {
        if (!player) return;
        const theGameGrids = getGameGrids(player);
        if (!theGameGrids){
            return;
        }
        let active = true;

        const refreshTurn = async () => {
            if (player.player == null){
                console.log("Le joueur ne joue pas.");
                return false;
            }
            const isPlayerOneTurn = await ItIsPlayerOneTurn(player, player.player.id, player.playerHeaders);

            if (active) {
                setItIsOurTurn(isPlayerOneTurn);
            }
        };

        refreshTurn();

        const timer = window.setInterval(refreshTurn, 5000);

        return () => {
            active = false;
            window.clearInterval(timer);
        };
    }, [player]);


    if (player != null){
        if (player.player == null){
            console.log("Le joueur ne joue pas.");
            return;
        }
        const theGameGrids = getGameGrids(player);
        if (!theGameGrids){
            return <p>Chargement en cours.</p>;
        }
        let gameGridPlay : number[][] = theGameGrids.PlayGameGridPlayer1; // Si on est le joueur 1.
        let thisIsPlayerOne = true;
        if (TheCurrentPlayerIsPlayerOne(player) == false){
            thisIsPlayerOne = false;
            gameGridPlay = theGameGrids.PlayGameGridPlayer2; // Si on est le joueur 2.
        }

        if (player.player == null){
            console.log("Le joueur ne joue pas.");
            return <p>Vous n'avez pas encore lancé une partie.</p>;
        }
        return (
            gameGridPlay.map((column, colIndex) => (
                <React.Fragment key={crypto.randomUUID()}>
                    <div className="lineCase">
                        {column.map((_line, lineIndex) => (
                            <article key={crypto.randomUUID()} className={gameGridPlay[colIndex][lineIndex] == 0 ? "caseGameGride caseGameGrideSelected" : "caseGameGride"}  onClick={() => {
                                if (player.player == null){
                                    console.log("Le joueur ne joue pas.");
                                    return;
                                }
                                if (!itIsOurTurn){
                                    return;
                                }
                                const x : number = lineIndex;
                                const y : number = colIndex;
                                if ((gameGridPlay.length > y && gameGridPlay[y].length > x && gameGridPlay[y][x] == 0) && (theGameGrids.GameGridPlayer2.length > y && theGameGrids.GameGridPlayer2[y].length > x)){
                                    console.log(x+" ; "+ y);
                                    const valueOrigine = theGameGrids.GameGridPlayer2[y][x];
                                    if (valueOrigine == 0){
                                        gameGridPlay[y][x] = 1; // 1 : on coule
                                        console.log("COULÉ !");
                                    } else {
                                        gameGridPlay[y][x] = 2; // 2 : on touche
                                        console.log("TOUCHÉ !");
    
                                        let numberOfSunkenBoat = 0;
                                        for (let i = 0; i < gameGridPlay.length; i++) {
                                            for (let j = 0; j < gameGridPlay[i].length; j++) {
                                                if (gameGridPlay[i][j] == 2){
                                                    numberOfSunkenBoat++;
                                                    if (numberOfSunkenBoat >= numberOfBoat){
                                                        // ↓ -------------------------↓ !! ↓------------------------- ↓
                                                        console.log("Le joueur à gagner !");
                                                        EndedGame(
                                                            player.player.id,
                                                            thisIsPlayerOne,
                                                            player.playerHeaders,
                                                        )
                                                        // ↑ -------------------------↑ !! ↑------------------------- ↑
                                                    }
                                                }
                                            }                                        
                                        }
                                    }

                                    if (TheCurrentPlayerIsPlayerOne(player)){
                                        theGameGrids.PlayGameGridPlayer1 = gameGridPlay.map(row => [...row]); // Si le joueur 1 joue.
                                    } else {
                                        theGameGrids.PlayGameGridPlayer2 = gameGridPlay.map(row => [...row]); // Si le joueur 2 joue.
                                    }
                                    const serializedBoard : string = JSON.stringify(theGameGrids);

                                    if (player != null) {
                                        setPlayer({
                                            ...player,
                                            player: {
                                            ...player.player,
                                            state: serializedBoard,
                                            },
                                        });
                                        const nextPlayer = player.player.players.find(
                                            (gamePlayer) => gamePlayer.id !== player.userId,
                                        );

                                        if (!nextPlayer) {
                                            console.error("Impossible de trouver le joueur suivant.");
                                            return;
                                        }

                                        WritePartOfTheGame(
                                            player.player.id,
                                            nextPlayer.id,
                                            player.playerHeaders,
                                            serializedBoard
                                        ).catch((err) => console.error("Erreur lors de la sauvegarde sur l'API :", err));
                                    }
                                }
                            }}
                        >
                            {gameGridPlay[colIndex][lineIndex] == 1 ? <div className='colorSunk'></div> : null}
                            {gameGridPlay[colIndex][lineIndex] == 2 ? <div className='colorHit'></div> : null}
                        </article>
                        ))}
                    </div>
                </React.Fragment>
            ))
        );
    } else {
        console.log("Le joueur n'est pas encore définie !")
    }
}


function GameGrid() {
    const { player, setPlayer } = useContext(PlayerContext);
    const [itIsOurTurn, setItIsOurTurn] = useState<number>(-1);

    useEffect(() => {
        let isActive = true;

        if (!player || !getGameGrids(player)) {
            setItIsOurTurn(-1);
            return () => {
                isActive = false;
            };
        }

        ItIsPlayerOneTurn(player, player.player.id, player.playerHeaders)
            .then((isPlayerOneTurn) => {
                if (isActive) {
                    setItIsOurTurn(isPlayerOneTurn ? 1 : 0);
                }
            });

        return () => {
            isActive = false;
        };
    }, [player]);

    return (
        <>
            {!getGameGrids(player) ? 
                <>
                    <p>Vous n'avez pas encore lancé une partie.</p>
                    <button onClick={async () => {
                        try {
                            const result = await ConnexionALaPartie(undefined, player);
                            setPlayer(result);
                        } catch (error) {
                            console.error('Échec du chargement des données du joueur :', error);
                        }
                    }}>Lancer la partie de test</button>
                </> : 
                <>
                    {itIsOurTurn == -1 ? <p>Chargement en cours...</p> :
                        <section className='theGrids'>
                            {itIsOurTurn == 1 ? <p>C'est à ton tours !</p> : <p>Ce n'est pas ton tours.</p>}
                            <MyGameGrid/>
                            <br/><br/><br/>
                            <GameGridPlay/>
                        </section>
                    }
                </>
            }
        </>
    );
}


export default GameGrid;