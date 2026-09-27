import { Link } from 'react-router'
import EtatVideStyles from './EtatVide.module.css'

const EtatVide = () => {
  return (
    <section className={EtatVideStyles.vide}>
      <span className={EtatVideStyles.ico}>· · ·&nbsp;&nbsp;SONAR&nbsp;&nbsp;CALME&nbsp;&nbsp;· · ·</span>
      <h2 className={EtatVideStyles.titre}>Vous êtes à jour</h2>
      <p className={EtatVideStyles.texte}>
        Tous vos tirs sont partis. On vous prévient dès qu'un adversaire répond —
        vous n'avez rien à surveiller.
      </p>
      <div className={EtatVideStyles.actions}>
        <Link className={EtatVideStyles.btnPrincipal} to="/parties/nouvelle">Défier quelqu'un par email</Link>
        <Link className={EtatVideStyles.btnFantome} to="/parties">Voir mes batailles en cours</Link>
      </div>
    </section>
  )
}

export default EtatVide