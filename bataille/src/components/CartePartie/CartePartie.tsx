import { Link } from 'react-router'
import type { ResumeAccueil } from '../../types'
import MiniRadar from '../MiniRadar/MiniRadar'
import CartePartieStyles from './CartePartie.module.css'

type CartePartieProps = {
  partie: ResumeAccueil
}

const CartePartie = ({ partie }: CartePartieProps) => {
  const aMoi = partie.tourDe === 'moi'

  return (
    <article className={[CartePartieStyles.carte, aMoi ? CartePartieStyles.jouable : CartePartieStyles.calme].join(' ')}>
      <MiniRadar cases={partie.radar} dernierTir={partie.dernierTir} />

      <div className={CartePartieStyles.corps}>
        <span className={[CartePartieStyles.statut, aMoi ? CartePartieStyles.statutMoi : CartePartieStyles.statutEux].join(' ')}>
          {aMoi ? '● À vous de jouer' : `○ Au tour de ${partie.adversaire}`}
        </span>
        <h3 className={CartePartieStyles.nom}>contre {partie.adversaire}</h3>
        <p className={CartePartieStyles.meta}>{partie.resume}</p>
      </div>

      <div className={CartePartieStyles.droite}>
        <span className={[CartePartieStyles.chrono, partie.urgent ? CartePartieStyles.chronoUrgent : ''].join(' ')}>
          {partie.echeance}
        </span>
        <Link
          className={[CartePartieStyles.btn, aMoi ? CartePartieStyles.btnSignal : CartePartieStyles.btnFantome].join(' ')}
          to={`/parties/${partie.id}`}
        >
          {aMoi ? 'Tirer →' : 'Relancer'}
        </Link>
      </div>
    </article>
  )
}

export default CartePartie