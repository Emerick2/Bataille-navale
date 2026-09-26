import {createContext, useEffect, useState} from "react";
import {TestAPI} from "../App";

export interface GameData{
    id: number;
    creatorId: number;
    minPlayers: number;
    maxPlayers: number;
    status: "pending" | "started" | "ended";
    players: Array<{
        id: number;
        email: string;
        profilePicture: string | null;
    }>;
    user: {
        id:number;
    };
    currentTurnUserId: number;
    isYourTurn: boolean;
    state: string;
    endData: string | null;
    createdAt: string;
    startedAt: string | null;
    endedAt: string | null;
    playerOneVictory: boolean;
    token : string;
}

export interface PlayerHeaders{
    Authorization : string;
}

export interface Player{
    player : GameData | null;
    playerHeaders : PlayerHeaders;
    userId: number;
}

export const PlayerContext = createContext<{ player: Player | null; setPlayer: (player: Player | null) => void; }>({
    player: null,
    setPlayer: () => {},
});

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
    const [player, setPlayer] = useState<Player | null>(null);
    const debug = false;

    if (debug) {
        useEffect(() => {
            let isActive = true;
            TestAPI()
            .then((result) => {
                if (isActive) {
                    setPlayer(result);
                }
            })
            .catch((error) => {
                console.error('Échec du chargement des données du joueur :', error);
            })

            return () => {
                isActive = false;
            };
        }, []);
    }
    
    return (
        <PlayerContext.Provider value={{ player, setPlayer }}>
        {children}
        </PlayerContext.Provider>
    );
};