import './GameGrid.css'
import React, {useContext, useState} from 'react';
import {EndedGame, ItIsPlayerOneTurn, TheCurrentPlayerIsPlayerOne, WritePartOfTheGame} from './GridFunctionality/ReadingAndWritingTheAPIGrid';
import {PlayerContext} from './context/PlayerContext';
import {GameInProgressPlayer, HistoryPlayer} from './GridFunctionality/DataPlayerAPI';

export const numberOfBoat : number = 9;

export interface TheGameGrids{
    GameGridPlayer1 : number[][]; // La grille avec les bateau J1
    GameGridPlayer2 : number[][]; // La grille avec les bateau J2
    PlayGameGridPlayer1 : number[][]; // La grille avec les tentatives J1
    PlayGameGridPlayer2 : number[][]; // La grille avec les tentatives J2
}

export const height : number = 10;

function MyGameGrid() {
    const { player } = useContext(PlayerContext);
    if (player != null){
        const theGameGrids : TheGameGrids = JSON.parse(player.player.state);
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
    } else {
        return <p>Chargement en cours.</p>
    }
}

function GameGridPlay() {
    const { player, setPlayer } = useContext(PlayerContext);
    // console.log("En jeu :")
    let itIsOurTurn : boolean = false;
    if (player != null){
        // console.log(player.player.state);
        // console.log(TheCurrentPlayerIsPlayerOne(player));
        ItIsPlayerOneTurn(player, player.player.id, player.playerHeaders)
            .then((isPlayerOneTurn) => itIsOurTurn = isPlayerOneTurn);
    }

    if (player != null){
        const theGameGrids : TheGameGrids = JSON.parse(player.player.state);
        let gameGridPlay : number[][] = theGameGrids.PlayGameGridPlayer1; // Si on est le joueur 1.
        let thisIsPlayerOne = true;
        if (TheCurrentPlayerIsPlayerOne(player) == false){
            thisIsPlayerOne = false;
            gameGridPlay = theGameGrids.PlayGameGridPlayer2; // Si on est le joueur 2.
        }

        // début debug
        // console.log("Le joueur à gagner !");
        // EndedGame(
        //     player.player.id,
        //     thisIsPlayerOne,
        //     player.playerHeaders,
        // )
        // fin debug

        return (
            gameGridPlay.map((column, colIndex) => (
                <React.Fragment key={crypto.randomUUID()}>
                    <div className="lineCase">
                        {column.map((line, lineIndex) => (
                            <article key={crypto.randomUUID()} className={gameGridPlay[colIndex][lineIndex] == 0 ? "caseGameGride caseGameGrideSelected" : "caseGameGride"}  onClick={(e) => {
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
    const { player } = useContext(PlayerContext);
    const [itIsOurTurn, setItIsOurTurn] = useState<boolean>(false);

    if (player != null){
        ItIsPlayerOneTurn(player, player.player.id, player.playerHeaders)
            .then((isPlayerOneTurn) => setItIsOurTurn(isPlayerOneTurn));
        
        HistoryPlayer(player.playerHeaders);
        GameInProgressPlayer(player.playerHeaders)
    }

    return (
        <section className='theGrids'>
            {itIsOurTurn ? <p>C'est à ton tours !</p> : <p>Ce n'est pas ton tours.</p>}
            <MyGameGrid/>
            <br/><br/><br/>
            <GameGridPlay/>
        </section>
    );
}


export default GameGrid;