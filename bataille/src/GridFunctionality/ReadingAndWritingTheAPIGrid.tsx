import type {GameData, Player, PlayerHeaders} from "../context/PlayerContext";

export const request = async (path: string, options: RequestInit = {})   => {
  const apiUrl = 'http://localhost:8000';
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  return response;
}

export const ReadPartOfTheGame = async (gameId: number, playerHeaders: PlayerHeaders) : Promise<Response | null> => {
    try {
        const response = await request(`/games/${gameId}`, {
            method: 'GET',
            headers: {
                ...playerHeaders,
            },
        })

        return response;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const WritePartOfTheGame = async (gameId : number, userID : number, playerHeaders : PlayerHeaders, serializedBoard : string) => {
    try {
        const response = await request(`/games/${gameId}/state`, {
            method: 'PUT',
            headers: {
                ...playerHeaders,
            },
            body: JSON.stringify({
                state: serializedBoard,
                currentTurnUserId: userID,
            }),
        })

        return response;
    } catch (error) {
        return error;
    }
}

export const AdvanceToTheNextRound = async (gameId : number, userID : number, playerHeaders : PlayerHeaders) => {
    try {
        const gameResponse = await request(`/games/${gameId}`, {
            method: 'GET',
            headers: {
                ...playerHeaders,
            },
        });
        
        if (!gameResponse.ok) {
            throw new Error(`Impossible de récupérer la partie : ${gameResponse.status}`);
        }
        
        const game = await gameResponse.json() as { state: string };
        const response = await request(`/games/${gameId}/state`, {
            method: 'PUT',
            headers: {
                ...playerHeaders,
            },
            body: JSON.stringify({
                state: game.state,
                currentTurnUserId: userID,
            }),
        });
        
        if (!response.ok) {
            throw new Error(`Impossible de passer au tour suivant : ${response.status}`);
        }
        console.log("tours suivant !");

        return response;
    } catch (error) {
        console.error(error);
    }
}

export const TheCurrentPlayerIsPlayerOne = (player: Player): boolean => {
    if (player.player == null){
        console.log("Le joueur ne joue pas.");
        return false;
    }
    return player.player.creatorId === player.userId;
};

export const ItIsPlayerOneTurn = async (player: Player, gameId: number, playerHeaders: PlayerHeaders): Promise<boolean> => {
    if (player.player == null){
        console.log("Le joueur ne joue pas.");
        return false;
    }
    try{
        const response = await ReadPartOfTheGame(gameId, playerHeaders);
        if (response != null) {
            if (!response.ok) return false;
            const gameData: GameData = await response.json();
            return gameData.currentTurnUserId === player.player.creatorId && gameData.status === "started";
        } else {
            return false;
        }
    } catch (error){
        console.error(error);
        return false;
    }
}

export const EndedGame = async (gameId : number, thePlayerOneVictory : boolean, playerHeaders : PlayerHeaders) => {
    try {
        const gameResponse = await request(`/games/${gameId}`, {
            method: 'GET',
            headers: {
                ...playerHeaders,
            },
        });
        
        if (!gameResponse.ok) {
            throw new Error(`Impossible de récupérer la partie : ${gameResponse.status}`);
        }

        const game = await gameResponse.json() as { state: string };
        const response = await request(`/games/${gameId}/state`, {
            method: 'PUT',
            headers: {
                ...playerHeaders,
            },
            body: JSON.stringify({
                state: game.state,
                ended: true,
                endData: JSON.stringify({ playerOneVictory: thePlayerOneVictory }),
            }),
        });
        
        if (!response.ok) {
            throw new Error(`Impossible de finir la partie : ${response.status}`);
        }
    } catch (error) {
        console.error(error);
    }
}