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

let oui = true
const mettreOuiSurTrue = () => {
    oui = true;
}

let dernierLine : number[] = [];

const mettreOuiSurFalse = (line : number[]) => {
    oui = false;
    
    if (dernierLine.length == 0){
        dernierLine = line
    }
    
    const valeur : Boolean = dernierLine === line

    if (valeur == false){
        dernierLine = line
    }
    return valeur;
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
                        <article key={lineIndex} className="caseGameGride caseGameGrideSelected"></article>
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