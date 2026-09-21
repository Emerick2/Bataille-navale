import './GameGrid.css'
import React, {useContext} from 'react';
import {WritePartOfTheGame} from './GridFunctionality/ReadingAndWritingTheAPIGrid';
import {PlayerContext} from './context/PlayerContext';

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
        return (
            theGameGrids.GameGridPlayer1.map((column, colIndex) => (
                <React.Fragment key={colIndex}>
                    <div className="lineCase">
                        {column.map((line, lineIndex) => (
                            line == 0 ? <article key={lineIndex} className="caseGameGride"></article> : <article key={lineIndex} className="caseGameGride boat"></article>
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
    console.log("En jeu :")
    if (player != null){
        console.log(player.player.state);
    }
    if (player != null){
        const theGameGrids : TheGameGrids = JSON.parse(player.player.state);
        const gameGridPlay : number[][] = theGameGrids.PlayGameGridPlayer1; // Si on est le joueur 1.

        return (
            gameGridPlay.map((column, colIndex) => (
                <React.Fragment key={colIndex}>
                    <div className="lineCase">
                        {column.map((line, lineIndex) => (
                            <article key={lineIndex} className={gameGridPlay[colIndex][lineIndex] == 0 ? "caseGameGride caseGameGrideSelected" : "caseGameGride"}  onClick={(e) => {
                                const x = lineIndex;
                                const y = colIndex;
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
                                                        // ↑ -------------------------↑ !! ↑------------------------- ↑
                                                    }
                                                }
                                            }                                        
                                        }
                                    }

                                    // Revenir ici pour la variante j1 / j2
                                    theGameGrids.PlayGameGridPlayer1 = gameGridPlay.map(row => [...row]);
                                    const serializedBoard : string = JSON.stringify(theGameGrids);

                                    if (player != null) {
                                        setPlayer({
                                            ...player,
                                            player: {
                                            ...player.player,
                                            state: serializedBoard,
                                            },
                                        });
                                        WritePartOfTheGame(
                                            player.player.id,
                                            player.player.creatorId,
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
        console.log("Le joueur n'est pas définie !")
    }
}


function GameGrid() {
    return (
        <section className='theGrids'>
            <MyGameGrid/>
            <br/><br/><br/>
            <GameGridPlay/>
        </section>
    );
}


export default GameGrid;