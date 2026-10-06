export type GameApiStatus = 'pending' | 'started' | 'ended'

export type GameApiPlayer = {
  id: number
  email: string
  profilePicture: string | null
}

export type GameApiData = {
  id: number
  creatorId: number
  minPlayers: number
  maxPlayers: number
  status: GameApiStatus
  players: GameApiPlayer[]
  currentTurnUserId: number | null
  isYourTurn: boolean
  state: string
  endData: string | null
  createdAt: string
  startedAt: string | null
  endedAt: string | null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isGameApiPlayer(value: unknown): value is GameApiPlayer {
  if (!isRecord(value)) return false

  return (
    typeof value.id === 'number' &&
    Number.isInteger(value.id) &&
    typeof value.email === 'string' &&
    (typeof value.profilePicture === 'string' || value.profilePicture === null)
  )
}

export function isGameApiData(value: unknown): value is GameApiData {
  if (!isRecord(value)) return false

  return (
    typeof value.id === 'number' &&
    Number.isInteger(value.id) &&
    typeof value.creatorId === 'number' &&
    typeof value.minPlayers === 'number' &&
    typeof value.maxPlayers === 'number' &&
    (value.status === 'pending' || value.status === 'started' || value.status === 'ended') &&
    Array.isArray(value.players) &&
    value.players.every(isGameApiPlayer) &&
    (typeof value.currentTurnUserId === 'number' || value.currentTurnUserId === null) &&
    typeof value.isYourTurn === 'boolean' &&
    typeof value.state === 'string' &&
    (typeof value.endData === 'string' || value.endData === null) &&
    typeof value.createdAt === 'string' &&
    (typeof value.startedAt === 'string' || value.startedAt === null) &&
    (typeof value.endedAt === 'string' || value.endedAt === null)
  )
}