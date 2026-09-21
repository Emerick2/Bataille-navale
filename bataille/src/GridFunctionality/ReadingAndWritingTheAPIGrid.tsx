import type {PlayerHeaders} from "../context/PlayerContext";

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

export const ReadPartOfTheGame = async (gameId: number, playerHeaders: PlayerHeaders) => {
    try {
        const response = await request(`/games/${gameId}/state`, {
            method: 'GET',
            headers: {
                ...playerHeaders,
            },
        })

        return response;
    } catch (erreur) {
        return erreur;
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
    } catch (erreur) {
        return erreur;
    }
}
