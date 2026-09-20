import {PlayerContext, request, type PlayerHeaders} from './App';
import './GameGrid.css'
import React, {useContext} from 'react';

const numberOfBoat : number = 9;

/**
 * Cette variable est un tableau à deux dimensions représentant l'état de la partie du joueur.
 * 0 : Rien ne sait passer.
 * 1 : Le joueur a coulé.
 * 2 : Le joueur a touché un bateau ennemie.
 */
let gameGridPlay : number[][] = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,1,0,2,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
]

export interface TheGameGrids{
    GameGridPlayer1 : number[][]; // La grille avec les bateau J1
    GameGridPlayer2 : number[][]; // La grille avec les bateau J2
    PlayGameGridPlayer1 : number[][]; // La grille avec les tentatives J1
    PlayGameGridPlayer2 : number[][]; // La grille avec les tentatives J2
}

const height : number = 10;

export const CleanGrid = () : number[][] => {
    const t = [];
    for (let i = 0; i < height; i++) {
        t.push([0,0,0,0,0,0,0,0,0,0]);
    }
    return t;
}

export const BuildTheBoard = () : number[][] => {
    const t = CleanGrid();

    let boat : number = numberOfBoat;
    
    while (boat > 0) {
        const x = Math.floor(Math.random() * height);
        const y = Math.floor(Math.random() * height);
        let taille = Math.floor(Math.random() * 4);
        if (taille > boat){
            taille = boat;
        }
        boat--;
        t[y][x] = 1;
        let right : boolean = false;
        let left : boolean = false;
        let up : boolean = false;
        let down : boolean = false;
        for (let i = 0; i < taille; i++) {
            if (i == 0){
                if (Math.floor(Math.random() * 2) == 1){
                    if (y+1 < height && t[y+1][x] == 0) {
                        up=true;
                    }
                } else {
                    if (x+1 < height && t[y][x+1] == 0) {
                        right=true;
                    }
                }
            }

            if (right == false && left == false && up == false && down == false){
                if (y+1 < height && t[y+1][x] == 0) {
                    up=true;
                } else if (y-1 < height && t[y-1][x] == 0) {
                    down=true;
                } else if (x+1 < height && t[y][x+1] == 0) {
                    right=true;
                } else if (x-1 < height && t[y][x-1] == 0) {
                    left=true;
                }
            }

            if (right && x+1 < height && t[y][x+1] == 0){
                t[y][x+1] = 1;
            } else if (left && x-1 < height && t[y][x-1] == 0){
                t[y][x-1] = 1;
            } else if (up && y+1 < height && t[y+1][x] == 0){
                t[y+1][x] = 1;
            } else if (down && y-1 < height && t[y-1][x+1] == 0){
                t[y-1][x] = 1;
            } else {
                break;
            }
            boat--;
        }
    }

    return t;
}


export const ReadPartOfTheGame = async (gameId : number, userID : number, playerHeaders : PlayerHeaders, serializedBoard : string) => {
    try {
        const response = await request(`/games/${gameId}/state`, {
            method: 'GET',
            headers: playerHeaders,
            body: JSON.stringify({
                state: serializedBoard,
                currentTurnUserId: userID,
            }),
        })

        return response;
    } catch (erreur) {
        return erreur;
    }
}

export const WritePartOfTheGame = async (gameId : number, userID : number, playerHeaders : PlayerHeaders, serializedBoard : string) => {
    try {
        const response = await request(`/games/${gameId}/state`, {
            method: 'PUT',
            headers: playerHeaders,
            body: JSON.stringify({
                state: serializedBoard,
                currentTurnUserId: userID,
            }),
        })

        return response;
    } catch (erreur) {
        return erreur;
    }
}

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
        gameGridPlay = theGameGrids.PlayGameGridPlayer1; // Si on est le joueur 1.

        return (
            gameGridPlay.map((column, colIndex) => (
                <React.Fragment key={colIndex}>
                    <div className="lineCase">
                        {column.map((line, lineIndex) => (
                            <article key={lineIndex} className={gameGridPlay[colIndex][lineIndex] == 0 ? "caseGameGride caseGameGrideSelected" : "caseGameGride"}  onClick={(e) => {
                                const x = lineIndex;
                                const y = colIndex;
                                if ((gameGridPlay.length > y && gameGridPlay[y].length > x && gameGridPlay[y][x] == 0) && (itsGameGrid.length > y && itsGameGrid[y].length > x)){
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