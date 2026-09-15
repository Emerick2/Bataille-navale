import './GameGrid.css'
import React from 'react';

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
                            console.log(x+" ; "+ y);
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