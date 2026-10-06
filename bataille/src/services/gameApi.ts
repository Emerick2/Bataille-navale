import type { PlayerHeaders } from '../context/PlayerContext'
import { request } from '../GridFunctionality/ReadingAndWritingTheAPIGrid'
import { isGameApiData, type GameApiData } from '../types/game-api'

export class GameApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'GameApiError'
    this.status = status
  }
}

async function parseGameResponse(response: Response): Promise<GameApiData> {
  if (!response.ok) {
    throw new GameApiError(response.status, `La requête a échoué (${response.status}).`)
  }

  const payload: unknown = await response.json()
  if (!isGameApiData(payload)) {
    throw new Error('La réponse du serveur ne respecte pas le format attendu.')
  }
  return payload
}

export async function getMyGames(
  headers: PlayerHeaders,
  signal?: AbortSignal,
): Promise<GameApiData[]> {
  const response = await request('/games/mine', {
    method: 'GET',
    headers: { ...headers },
    signal,
  })
  if (!response.ok) {
    throw new GameApiError(response.status, `Impossible de charger les parties (${response.status}).`)
  }

  const payload: unknown = await response.json()
  if (!Array.isArray(payload) || !payload.every(isGameApiData)) {
    throw new Error('La réponse du serveur ne contient pas une liste de parties valide.')
  }
  return payload
}

export async function getGameById(
  gameId: number,
  headers: PlayerHeaders,
  signal?: AbortSignal,
): Promise<GameApiData> {
  const response = await request(`/games/${gameId}`, {
    method: 'GET',
    headers: { ...headers },
    signal,
  })
  return parseGameResponse(response)
}