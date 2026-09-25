import {type GameData, type Player, type PlayerHeaders} from "../context/PlayerContext";
import {BuildTheBoard, CleanGrid} from "./CreationOfTheGrid";
import type {TheGameGrids} from "../GameGrid";

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
            return gameData.currentTurnUserId === player.userId && gameData.status === "started";
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


export const ConnexionALaPartie = async (identifiantPartie: number | undefined, player: Player | null): Promise<Player | null> => {
    if (player == null) {
        return null;
    }
    console.log("Début connexion");

    const board: TheGameGrids = {
        GameGridPlayer1: BuildTheBoard(),
        GameGridPlayer2: BuildTheBoard(),
        PlayGameGridPlayer1: CleanGrid(),
        PlayGameGridPlayer2: CleanGrid(),
    };
    const serializedBoard = JSON.stringify(board);

    try {
        if (identifiantPartie !== undefined) {
            const existingGameResponse = await ReadPartOfTheGame(identifiantPartie, player.playerHeaders);
            if (existingGameResponse && existingGameResponse.ok) {
                const existingGame = await existingGameResponse.json() as GameData;
                console.log("Partie existante rejointe avec succès !");
                return { ...player, player: existingGame };
            }
        }

        // Vérification des parties en cours
        const myGamesResponse = await request('/games/mine', {
            method: 'GET',
            headers: { ...player.playerHeaders },
        });

        if (myGamesResponse.ok) {
            const myGames : GameData[] = await myGamesResponse.json() as GameData[];
                const activeGame : GameData | undefined =
                    myGames.find(g => g.status === 'started') ??
                    myGames.find(g => g.status === 'pending');
            if (activeGame) {
                console.log(`Récupération de la partie existante en cours : ${activeGame.id}`);
                const canStartActiveGame =
                    activeGame.status === 'pending' &&
                    activeGame.creatorId === player.userId &&
                    activeGame.players.length >= activeGame.minPlayers;

                if (canStartActiveGame) {
                    const startResponse = await request(`/games/${activeGame.id}/start`, {
                        method: 'POST',
                        headers: { ...player.playerHeaders },
                        body: JSON.stringify({
                            state: serializedBoard,
                            currentTurnUserId: player.userId,
                        }),
                    });
                    if (!startResponse.ok) {
                        const latestGameResponse = await ReadPartOfTheGame(activeGame.id, player.playerHeaders);
                        const latestGame = latestGameResponse?.ok
                            ? await latestGameResponse.json() as GameData
                            : null;

                        if (latestGame?.status !== 'started') {
                            const errorBody = await startResponse.text();
                            throw new Error(
                                `Impossible de démarrer la partie : ${startResponse.status} ${errorBody}`,
                            );
                        }
                    }
                }
                const finalGameResponse: Response | null = await ReadPartOfTheGame(activeGame.id, player.playerHeaders);
                if (finalGameResponse && finalGameResponse.ok) {
                    return {
                        ...player,
                        player: await finalGameResponse.json() as GameData,
                    };
                }
            }
        }

        const createResponse = await request('/games', {
            method: 'POST',
            headers: { ...player.playerHeaders },
            body: JSON.stringify({ minPlayers: 1, maxPlayers: 2 }),
        });
        if (!createResponse.ok) {
            throw new Error(`Impossible de créer la partie : ${createResponse.status}`);
        }
        const createdGame = await createResponse.json() as GameData;
        const gameId = createdGame.id;

        const mailInvitee = "a@a";
        const inviteResponse = await request(`/games/${gameId}/invite`, {
            method: 'POST',
            headers: { ...player.playerHeaders },
            body: JSON.stringify({ email: mailInvitee }),
        });
        
        if (!inviteResponse.ok && inviteResponse.status !== 409) {
            throw new Error(`Impossible d'inviter le joueur : ${inviteResponse.status}`);
        }

        const startResponse = await request(`/games/${gameId}/start`, {
            method: 'POST',
            headers: { ...player.playerHeaders },
            body: JSON.stringify({
                state: serializedBoard,
                currentTurnUserId: player.userId,
            }),
        });
        
        if (!startResponse.ok && startResponse.status !== 400) {
            throw new Error(`Impossible de démarrer la partie : ${startResponse.status}`);
        }

        const finalGameResponse = await ReadPartOfTheGame(gameId, player.playerHeaders);
        if (finalGameResponse == null || !finalGameResponse.ok) {
            throw new Error(`Impossible de lire la partie créée : ${finalGameResponse?.status ?? 'réseau indisponible'}`);
        }

        return {
            ...player,
            player: await finalGameResponse.json() as GameData,
        };
    } catch (error) {
        console.error("Connexion à la partie impossible :", error);
        return player;
    }
}
