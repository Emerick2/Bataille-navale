import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router'
import PartieJoueur from '../../components/PartieJoueur/PartieJoueur'
import EtatVide from '../../EtatVide/EtatVide'
import HeroVisiteur from '../../components/HeroVisiteur/HeroVisiteur'
import HomeStyles from './Home.module.css'
import { AuthContext } from '../../context/AuthContext'
import { GameApiError, getMyGames } from '../../services/gameApi'
import type { GameApiData } from '../../types/game-api'

const Home = () => {
  const { status, user, token } = useContext(AuthContext)
  const [parties, setParties] = useState<GameApiData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    if (status === 'loading') return () => controller.abort()
    if (status !== 'authenticated' || token === null || user === null) {
      setIsLoading(false)
      setParties([])
      return () => controller.abort()
    }

    setIsLoading(true)
    setError(null)
    void getMyGames({ Authorization: `Bearer ${token}` }, controller.signal)
      .then((result) => {
        if (active) setParties(result.filter((partie) => partie.status === 'started'))
      })
      .catch((reason: unknown) => {
        if (!active || controller.signal.aborted) return
        if (reason instanceof GameApiError && reason.status === 401) {
          setError('Votre session a expiré. Reconnectez-vous pour continuer.')
        } else {
          setError(reason instanceof Error ? reason.message : 'Impossible de charger les parties.')
        }
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [status, token, user, retryCount])

  if (status === 'loading' || (status === 'authenticated' && user === null)) {
    return <p>Chargement...</p>
  }

  if (status === 'anonymous') {
    return <HeroVisiteur />
  }

  if (isLoading) return <p>Chargement de vos parties...</p>

  return (
    <div className={HomeStyles.accueil}>
      <header className={HomeStyles.entete}>
        <div>
          <h1 className={HomeStyles.titre}>Bon retour, {user?.email}.</h1>
        </div>
      </header>

      {error ? (
        <section>
          <p role="alert">{error}</p>
          <button type="button" onClick={() => setRetryCount((count) => count + 1)}>
            Réessayer
          </button>
        </section>
      ) : parties.length === 0 ? (
        <EtatVide />
      ) : (
        <>
          {(['À vous de jouer', 'En attente de l’adversaire'] as const).map((titre, index) => {
            const groupe = parties.filter((partie) => partie.isYourTurn === (index === 0))
            if (groupe.length === 0) return null
            return (
              <section className={HomeStyles.section} key={titre}>
                <h2 className={HomeStyles.sectionTitre}>{titre} · {groupe.length}</h2>
                <div className={HomeStyles.parties}>
                  {groupe.map((partie) => (
                    <PartieJoueur key={partie.id} partie={partie} userId={user!.id} />
                  ))}
                </div>
              </section>
            )
          })}
          <p><Link to="/parties">Voir toutes mes parties</Link></p>
        </>
      )}
    </div>
  )
}

export default Home