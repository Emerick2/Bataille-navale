import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router'
import PartieJoueur from '../../components/PartieJoueur/PartieJoueur'
import { AuthContext } from '../../context/AuthContext'
import type { GameApiData } from '../../types/game-api'
import { getMyGames, GameApiError } from '../../services/gameApi'
import {PlayerContext} from '../../context/PlayerContext'

const Games = () => {
    const { status, token, user } = useContext(AuthContext)
    const [parties, setParties] = useState<GameApiData[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [retryCount, setRetryCount] = useState(0)
    const { player, setPlayer } = useContext(PlayerContext);
    

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
                if (active) setParties(result)
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

    if (status === 'loading' || isLoading) return <p>Chargement de vos parties...</p>
    if (status === 'anonymous') {
        return <p>Connectez-vous pour voir vos parties. <Link to="/connexion">Connexion</Link></p>
    }

    return (
        <div>
            <h1>Mes parties</h1>
            {error ? (
                <section>
                    <p role="alert">{error}</p>
                    <button type="button" onClick={() => setRetryCount((count) => count + 1)}>
                        Réessayer
                    </button>
                </section>
            ) : parties.length === 0 ? (
                <p>Aucune partie accessible pour le moment.</p>
            ) : (
                <>
                    {(['started', 'pending', 'ended'] as const).map((statusFilter) => {
                        const group = parties.filter((partie) => partie.status === statusFilter)
                        if (group.length === 0) return null

                        if (statusFilter === 'started') {
                            const aVousDeJouer = group.filter((partie) => partie.isYourTurn)
                            const enAttente = group.filter((partie) => !partie.isYourTurn)
                            return (
                                <section key={statusFilter}>
                                    {aVousDeJouer.length > 0 && (
                                        <>
                                            <h2>À vous de jouer</h2>
                                            <div className="listeParties">
                                                {aVousDeJouer.map((partie) => (
                                                    <PartieJoueur key={partie.id} partie={partie} userId={user!.id} player={player} idGame={partie.id} setPlayer={setPlayer}/>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                    {enAttente.length > 0 && (
                                        <>
                                            <h2>En attente de l’adversaire</h2>
                                            <div className="listeParties">
                                                {enAttente.map((partie) => (
                                                    <PartieJoueur key={partie.id} partie={partie} userId={user!.id} />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </section>
                            )
                        }

                        if (statusFilter === 'pending') {
                            const enAttenteDeJoueurs = group.filter(
                                (partie) => partie.players.length < partie.minPlayers,
                            )
                            const enAttenteAdversaire = group.filter(
                                (partie) => partie.players.length >= partie.minPlayers,
                            )
                            return (
                                <section key={statusFilter}>
                                    {enAttenteAdversaire.length > 0 && (
                                        <>
                                            <h2>En attente de l’adversaire</h2>
                                            <div className="listeParties">
                                                {enAttenteAdversaire.map((partie) => (
                                                    <PartieJoueur key={partie.id} partie={partie} userId={user!.id} />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                    {enAttenteDeJoueurs.length > 0 && (
                                        <>
                                            <h2>En attente de joueurs</h2>
                                            <div className="listeParties">
                                                {enAttenteDeJoueurs.map((partie) => (
                                                    <PartieJoueur key={partie.id} partie={partie} userId={user!.id} />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </section>
                            )
                        }

                        return (
                            <section key={statusFilter}>
                                <h2>Terminées récemment</h2>
                                <div className="listeParties">
                                    {group.map((partie) => (
                                        <PartieJoueur key={partie.id} partie={partie} userId={user!.id} />
                                    ))}
                                </div>
                                {statusFilter === 'ended' && <Link to="/historique">Consulter l’historique</Link>}
                            </section>
                        )
                    })}
                </>
            )}
        </div>
    )
}


export default Games