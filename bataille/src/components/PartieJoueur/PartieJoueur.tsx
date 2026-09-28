import { Link } from 'react-router'
import type { GameApiData } from '../../types/game-api'
import styles from './PartieJoueur.module.css'
import {AbandonGame} from '../../GridFunctionality/ReadingAndWritingTheAPIGrid'
import type {Player} from '../../context/PlayerContext'

type PartieJoueurProps = {
  partie: GameApiData;
  userId: number;
  detail?: string;
  player? : Player | null;
  idGame? : number;
  setPlayer?: (player: Player | null) => void;
}

const PartieJoueur = ({ partie, userId, detail, player, idGame, setPlayer }: PartieJoueurProps) => {
  const adversaire = partie.players.find((joueur) => joueur.id !== userId)
  const statut = partie.status === 'started'
    ? partie.isYourTurn ? 'À vous de jouer' : 'En attente de l’adversaire'
    : partie.status === 'pending'
      ? partie.players.length < partie.minPlayers ? 'En attente de joueurs' : 'En attente de l’adversaire'
      : 'Terminée récemment'

  const contenu = (
    <>
      {player != null && player != undefined && idGame != undefined && setPlayer != undefined ? 
        <button onClick={() => {
          AbandonGame(player, idGame, setPlayer);
        }}>Abandonné</button>
      : null }
      
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