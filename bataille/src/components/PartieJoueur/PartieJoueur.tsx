import { Link } from 'react-router'
import type { GameApiData } from '../../types/game-api'
import styles from './PartieJoueur.module.css'

type PartieJoueurProps = {
  partie: GameApiData
  userId: number
  detail?: string
}

const PartieJoueur = ({ partie, userId, detail }: PartieJoueurProps) => {
  const adversaire = partie.players.find((joueur) => joueur.id !== userId)
  const statut = partie.status === 'started'
    ? partie.isYourTurn ? 'À vous de jouer' : 'En attente de l’adversaire'
    : partie.status === 'pending'
      ? partie.players.length < partie.minPlayers ? 'En attente de joueurs' : 'En attente de l’adversaire'
      : 'Terminée récemment'

  const contenu = (
    <>
      <span className={styles.statut}>{statut}</span>
      <strong className={styles.adversaire}>
        {adversaire ? `Partie contre ${adversaire.email}` : `Partie n° ${partie.id}`}
      </strong>
      {detail && <span className={styles.detail}>{detail}</span>}
      <span className={styles.identifiant}>Partie {partie.id}</span>
      {partie.status === 'started' && <span className={styles.action}>Ouvrir la partie</span>}
    </>
  )

  return partie.status === 'started' ? (
    <Link className={styles.partie} to={`/parties/${partie.id}`}>
      {contenu}
    </Link>
  ) : (
    <article className={styles.partie}>
      {contenu}
    </article>
  )
}

export default PartieJoueur