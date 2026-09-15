import './GameGrid.css'
import React from 'react';

const numberOfBoat = 9;

const myGameGrid = [
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

const itsGameGrid = [
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

const gameGridPlay = [
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

interface ShootAtASquareProps {
    x : number;
    y : number;
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
                                } else {
                                    gameGridPlay[y][x] = 2; // 2 : on touche

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