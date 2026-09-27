import {height, numberOfBoat} from "../GameGrid";

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
                } else if (y-1 >= 0 && t[y-1][x] == 0) {
                    down=true;
                } else if (x+1 < height && t[y][x+1] == 0) {
                    right=true;
                } else if (x-1 >= 0 && t[y][x-1] == 0) {
                    left=true;
                }
            }

            if (right && x+1 < height && t[y][x+1] == 0){
                t[y][x+1] = 1;
            } else if (left && x-1 >= 0 && t[y][x-1] == 0){
                t[y][x-1] = 1;
            } else if (up && y+1 < height && t[y+1][x] == 0){
                t[y+1][x] = 1;
            } else if (down && y-1 >= 0 && t[y-1][x] == 0){
                t[y-1][x] = 1;
            } else {
                break;
            }
            boat--;
        }
    }

    return t;
}
