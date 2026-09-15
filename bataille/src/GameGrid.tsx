import './GameGrid.css'
import React from 'react';

const myGameGrid = [
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


function GameGrid() {
    return (
        myGameGrid.map((column, colIndex) => (
            <React.Fragment key={colIndex}>
                <div className="lineCase">
                    {column.map((line, lineIndex) => (
                        <article key={lineIndex} className="caseGameGride"></article>
                    ))}
                </div>
                {/* <br/> */}
            </React.Fragment>
        ))
    );
}

export default GameGrid;