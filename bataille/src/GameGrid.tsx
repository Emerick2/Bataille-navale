import './GameGrid.css'
import React from 'react';

const numberOfBoat : number = 9;

/**
 * Cette variable est un tableau à deux dimensions représentant l'état de la carte du joueur qui joue.
 * 0 : Il n'y a rien.
 * 1 : Il y a un bateau.
*/
let myGameGrid : number[][] = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,0,0],
    [0,1,1,0,0,0,0,1,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,1,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,1,1]
]

/**
 * Cette variable est un tableau à deux dimensions représentant l'état de la carte du joueur adverse.
 * 0 : Il n'y a rien.
 * 1 : Il y a un bateau.
*/
let itsGameGrid : number[][] = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,0,0],
    [0,1,1,0,0,0,0,1,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,1,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,1,1]
]

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

const height : number = 10;

interface ShootAtASquareProps {
    x : number;
    y : number;
}

const CleanGrid = () : number[][] => {
    const t = [];
    for (let i = 0; i < height; i++) {
        t.push([0,0,0,0,0,0,0,0,0,0]);
    }
    return t;
}

const BuildTheBoard = () : number[][] => {
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

const ShootAtASquare = ({x, y} : ShootAtASquareProps) => {
    console.log(x+" ; "+ y);
}

function MyGameGrid() {
    return (
        myGameGrid.map((column, colIndex) => (
            <React.Fragment key={colIndex}>
                <div className="lineCase">
                    {column.map((line, lineIndex) => (
                        line == 0 ? <article key={lineIndex} className="caseGameGride"></article> : <article key={lineIndex} className="caseGameGride boat"></article>
                    ))}
                </div>
            </React.Fragment>
        ))
    );
}

function GameGridPlay() {
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
                                const valueOrigine = itsGameGrid[y][x];
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
}


function GameGrid() {
    // Cela sera appeller au début de la partie.
    gameGridPlay = CleanGrid();
    myGameGrid = BuildTheBoard();
    itsGameGrid = BuildTheBoard();
    // sauvegarder les grilles.

    return (
        <section className='theGrids'>
            <MyGameGrid/>
            {/* <span className='espaceVide'/> */}
            <br/><br/><br/>
            <GameGridPlay/>
        </section>
    );
}


export default GameGrid;