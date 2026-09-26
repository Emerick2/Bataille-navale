import {type GameData, type Player, type PlayerHeaders} from "../context/PlayerContext";
import {BuildTheBoard, CleanGrid} from "./CreationOfTheGrid";
import type {TheGameGrids} from "../GameGrid";
import type {HistoryBloc} from "../pages/History/History";

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

export const EndedGame = async (gameId : number, thePlayerOneVictory : boolean, playerHeaders : PlayerHeaders) : Promise<GameData | null> => {
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

        const updatedGame : GameData = await response.json() as GameData;
        return updatedGame;
    } catch (error) {
        console.error(error);
        return null;
    }
}


export const ConnexionALaPartie = async (identifiantPartie: number | undefined, player: Player | null, mailInvitee: string = ""): Promise<Player | null> => {
    if (player == null) {
        return null;
    }
    console.log("Début connexion");

    try {
        if (mailInvitee && mailInvitee !== "") {
            const myGamesResponse = await request('/games/mine', {
                method: 'GET',
                headers: { ...player.playerHeaders },
            });

            let existingGameWithMail: GameData | undefined = undefined;
            if (myGamesResponse.ok) {
                const myGames: GameData[] = await myGamesResponse.json() as GameData[];
                existingGameWithMail = myGames.find(g => 
                    g.players && g.players.some(p => p.email === mailInvitee)
                );
            }

            if (existingGameWithMail) {
                console.log(`Partie existante trouvée avec ${mailInvitee} (ID: ${existingGameWithMail.id})`);
                const finalGameResponse = await ReadPartOfTheGame(existingGameWithMail.id, player.playerHeaders);
                if (finalGameResponse && finalGameResponse.ok) {
                    return {
                        ...player,
                        player: await finalGameResponse.json() as GameData,
                    };
                }
            } else {
                console.log(`Création d'une nouvelle partie contre ${mailInvitee}`);
                
                const board: TheGameGrids = {
                    GameGridPlayer1: BuildTheBoard(),
                    GameGridPlayer2: BuildTheBoard(),
                    PlayGameGridPlayer1: CleanGrid(),
                    PlayGameGridPlayer2: CleanGrid(),
                };
                const serializedBoard = JSON.stringify(board);

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

                const inviteResponse = await request(`/games/${gameId}/invite`, {
                    method: 'POST',
                    headers: { ...player.playerHeaders },
                    body: JSON.stringify({ email: mailInvitee }),
                });
                
                if (!inviteResponse.ok) {
                    let errorMessage = `statut HTTP ${inviteResponse.status}`;
                    try {
                        const errorBody = await inviteResponse.json() as { error?: unknown };
                        if (typeof errorBody.error === 'string' && errorBody.error.length > 0) {
                            errorMessage = errorBody.error;
                        }
                    } catch {
                        // Keep the HTTP status when the server does not return JSON.
                    }
                    throw new Error(`Impossible d'inviter le joueur : ${errorMessage}`);
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
                    throw new Error(`Impossible de lire la partie créée.`);
                }

                return {
                    ...player,
                    player: await finalGameResponse.json() as GameData,
                };
            }
        } 

        else if (identifiantPartie !== undefined) {
            console.log(`Rejoindre la partie par ID : ${identifiantPartie}`);
            const existingGameResponse = await ReadPartOfTheGame(identifiantPartie, player.playerHeaders);
            if (existingGameResponse && existingGameResponse.ok) {
                const existingGame = await existingGameResponse.json() as GameData;
                
                if (!existingGame.state || existingGame.state === "") {
                    const board: TheGameGrids = {
                        GameGridPlayer1: BuildTheBoard(),
                        GameGridPlayer2: BuildTheBoard(),
                        PlayGameGridPlayer1: CleanGrid(),
                        PlayGameGridPlayer2: CleanGrid(),
                    };
                    existingGame.state = JSON.stringify(board);
                }

                return { ...player, player: existingGame };
            }
            throw new Error(`Impossible de trouver la partie avec l'ID ${identifiantPartie}`);
        }
        else {
            throw new Error("Erreur : Aucun mail d'invité fourni et aucun identifiant de partie spécifié.");
        }

    } catch (error) {
        console.error("Connexion à la partie impossible :", error);
        throw error;
    }
    return null;
}

export const ListOfAccessibleSections = async (player : Player) : Promise<HistoryBloc[]> => {
    const listOfGame : HistoryBloc[] = [];
    
    try {
        const myGamesResponse = await request('/games/mine', {
            method: 'GET',
            headers: { ...player.playerHeaders },
        });

        if (myGamesResponse.ok) {
            const games : GameData[] = await myGamesResponse.json() as GameData[];

            for (let i = 0; i < games.length; i++) {
                const newObject : HistoryBloc = {
                    nameOne : games[i].creatorId.toString(),
                    nameTwo : "Nom2",
                    status : games[i].status,
                    createdAt : games[i].createdAt,
                    idGame : games[i].id
                };
                
                listOfGame.push(newObject);
            }
        } else {
            throw new Error("Erreur lors de l'envoie des requêtes à l'API.");
        }
    } catch (error) {
        console.error(error);
        throw new Error("Erreur lors de la récupération des parties du joueur.");
    }

    return listOfGame;
}