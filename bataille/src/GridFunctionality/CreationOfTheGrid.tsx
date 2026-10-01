import {height, numberOfBoat} from "../GameGrid";

/**
 * Cette fonction va permettre de vidée une grille de 10 sur 10.
 * Renvoie : Une grille vide de 10 sur 10.
 */
export const CleanGrid = () : number[][] => {
    const t = [];
    for (let i = 0; i < height; i++) {
        t.push([0,0,0,0,0,0,0,0,0,0]);
    }
    return t;
}

/**
 * Cette fonction va permettre de placer les bateaux sur la carte.
 * Renvoie : Une grille avec les bateaux positionnés aux bons endroits.
 */
export const BuildTheBoard = () : number[][] => {
    const t = CleanGrid();

    let boat : number = numberOfBoat;
    
    while (boat > 0) {
        const x = Math.floor(Math.random() * height);
        const y = Math.floor(Math.random() * height);
        let taille = Math.floor(Math.random() * 6)+1;
        if (taille-1 >= boat){
            taille+=1
        }

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
