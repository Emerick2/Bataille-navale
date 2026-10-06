import { useContext, useEffect } from 'react'
import { AuthContext } from './AuthContext'
import { PlayerContext } from './PlayerContext'

const AuthPlayerBridge = () => {
  const { session, status } = useContext(AuthContext)
  const { player, setPlayer } = useContext(PlayerContext)
  const sessionUserId = session?.user.id ?? null
  const sessionToken = session?.token ?? null
  const currentAuthorization = player?.playerHeaders.Authorization ?? null

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'anonymous') {
      if (player !== null) setPlayer(null)
      return
    }

    if (sessionUserId === null || sessionToken === null) {
      return
    }

    const authorization = `Bearer ${sessionToken}`

    if (player !== null && player.userId === sessionUserId) {
      if (currentAuthorization !== authorization) {
        setPlayer({
          ...player,
          playerHeaders: {
            ...player.playerHeaders,
            Authorization: authorization,
          },
        })
      }
      return
    }

    setPlayer({
      player: null,
      playerHeaders: { Authorization: authorization },
      userId: sessionUserId,
    })
  }, [status, sessionUserId, sessionToken, currentAuthorization, player])

  return null
}

export default AuthPlayerBridge