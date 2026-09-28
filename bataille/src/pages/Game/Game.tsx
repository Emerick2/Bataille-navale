import { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { ConnexionALaPartie } from '../../GridFunctionality/ReadingAndWritingTheAPIGrid'
import { AuthContext } from '../../context/AuthContext'
import { PlayerContext } from '../../context/PlayerContext'
import GameGrid from '../../GameGrid'
import { GameApiError, getGameById } from '../../services/gameApi'
import type { GameApiData } from '../../types/game-api'

type PageState =
  | { kind: 'loading' }
  | { kind: 'pending'; game: GameApiData }
  | { kind: 'ended'; game: GameApiData }
  | { kind: 'started' }
  | { kind: 'error'; message: string }

function parseGameId(value: string | undefined): number | null {
  if (!value || !/^\d+$/.test(value)) return null
  const gameId = Number(value)
  return Number.isSafeInteger(gameId) && gameId > 0 ? gameId : null
}

function errorMessage(error: unknown): string {
  if (error instanceof GameApiError) {
    if (error.status === 401) return 'Votre session a expiré. Reconnectez-vous pour continuer.'
    if (error.status === 403) return 'Vous n’êtes pas autorisé à accéder à cette partie.'
    if (error.status === 404) return 'Cette partie est introuvable.'
  }
  if (error instanceof TypeError) return 'Le serveur est injoignable. Vérifiez votre connexion puis réessayez.'
  return error instanceof Error ? error.message : 'Une erreur est survenue pendant le chargement.'
}

const Game = () => {
  const { gameId: rawGameId } = useParams()
  const gameId = parseGameId(rawGameId)
  const { status, token, user } = useContext(AuthContext)
  const { player, setPlayer } = useContext(PlayerContext)
  const [pageState, setPageState] = useState<PageState>({ kind: 'loading' })
  const [retryCount, setRetryCount] = useState(0)
  const compatibleUserId = player?.userId ?? null
  const currentGameId = player?.player?.id ?? null
  const currentGameStatus = player?.player?.status ?? null

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    if (status === 'loading') {
      setPageState({ kind: 'loading' })
      return () => controller.abort()
    }

    if (status === 'anonymous' || token === null || user === null) {
      setPageState({ kind: 'error', message: 'Connectez-vous pour accéder à vos parties.' })
      return () => controller.abort()
    }

    if (gameId === null) {
      setPageState({ kind: 'error', message: 'L’identifiant de partie dans l’adresse est invalide.' })
      return () => controller.abort()
    }

    if (compatibleUserId !== user.id || player === null) {
      setPageState({ kind: 'loading' })
      return () => controller.abort()
    }

    if (currentGameId === gameId && currentGameStatus === 'started') {
      setPageState({ kind: 'started' })
      return () => controller.abort()
    }

    const headers = { Authorization: `Bearer ${token}` }
    setPageState({ kind: 'loading' })

    const loadGame = async () => {
      try {
        const game = await getGameById(gameId, headers, controller.signal)
        if (!active) return

        if (game.status === 'pending') {
          setPageState({ kind: 'pending', game })
          return
        }
        if (game.status === 'ended') {
          setPageState({ kind: 'ended', game })
          return
        }

        const loadedPlayer = await ConnexionALaPartie(gameId, player, '')
        if (!active) return
        if (loadedPlayer === null) {
          setPageState({ kind: 'error', message: 'Impossible d’initialiser cette partie.' })
          return
        }

        setPlayer(loadedPlayer)
        setPageState({ kind: 'started' })
      } catch (error) {
        if (active && !controller.signal.aborted) {
          setPageState({ kind: 'error', message: errorMessage(error) })
        }
      }
    }

    void loadGame()
    return () => {
      active = false
      controller.abort()
    }
  }, [gameId, status, token, user, compatibleUserId, currentGameId, currentGameStatus, setPlayer, retryCount])

  if (pageState.kind === 'started') return <GameGrid />

  return (
    <section aria-live="polite">
      {pageState.kind === 'loading' && <p>Chargement de la partie...</p>}
      {pageState.kind === 'pending' && (
        <>
          <h1>En attente d’un autre joueur</h1>
          <p>La partie {pageState.game.id} n’a pas encore commencé.</p>
        </>
      )}
      {pageState.kind === 'ended' && (
        <>
          <h1>Cette partie est terminée</h1>
          <p>Consultez votre historique pour retrouver le résultat.</p>
          <Link to="/historique">Voir l’historique</Link>
        </>
      )}
      {pageState.kind === 'error' && (
        <>
          <h1>Partie indisponible</h1>
          <p role="alert">{pageState.message}</p>
          <button type="button" onClick={() => setRetryCount((count) => count + 1)}>
            Réessayer
          </button>
        </>
      )}
      <p><Link to="/parties">Retour à mes parties</Link></p>
    </section>
  )
}

export default Game