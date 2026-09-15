import './GameGrid.css'
import React from 'react';

const numberOfBoat = 9;

let myGameGrid = [
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

let itsGameGrid = [
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

let gameGridPlay = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
]

const height = 10;

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
                        <article key={lineIndex} className="caseGameGride caseGameGrideSelected"  onClick={(e) => {
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
                    />
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