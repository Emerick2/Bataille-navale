import type {GameData, PlayerHeaders} from "../context/PlayerContext";
import {request} from "./ReadingAndWritingTheAPIGrid";

export const HistoryPlayer = async (playerHeaders : PlayerHeaders): Promise<GameData[]> => {
    const response = await request(`/games/history`, {
        method: 'GET',
        headers: {
            ...playerHeaders,
        },
    });

    if (!response.ok) {
        throw new Error(`Impossible de récupérer les données de l'historique : ${response.status}`);
    }

    return response.json() as Promise<GameData[]>;
}

export const GameInProgressPlayer = async (playerHeaders : PlayerHeaders): Promise<GameData[]> => {
    const response = await request(`/games/mine`, {
        method: 'GET',
        headers: {
            ...playerHeaders,
        },
    });

    if (!response.ok) {
        throw new Error(`Impossible de récupérer les données de l'historique des parties en cours : ${response.status}`);
    }

    return response.json() as Promise<GameData[]>;
}