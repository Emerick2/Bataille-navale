import { Link } from 'react-router'
import HeroVisiteurStyles from './HeroVisiteur.module.css'

const HeroVisiteur = () => {
  return (
    <section className={HeroVisiteurStyles.hero}>
      <span className={HeroVisiteurStyles.etiquette}>
        <span className={HeroVisiteurStyles.point} />
        Jeu au tour par tour · sans rendez-vous
      </span>

      <h1 className={HeroVisiteurStyles.titre}>
        Coulez leur flotte.<br />Prenez tout votre temps.
      </h1>

      <p className={HeroVisiteurStyles.accroche}>
        Une bataille navale qui ne vous demande pas d'être là en même temps que votre
        adversaire. Vous tirez, vous fermez l'onglet. Il jouera quand il pourra.
      </p>

      <div className={HeroVisiteurStyles.actions}>
        <Link className={HeroVisiteurStyles.btnPrincipal} to="/inscription">Créer mon compte</Link>
        <Link className={HeroVisiteurStyles.btnFantome} to="/connexion">J'ai déjà un compte</Link>
      </div>

      <p className={HeroVisiteurStyles.note}>
        Gratuit. Une adresse email suffit, la vôtre et celle de votre adversaire.
      </p>
    </section>
  )
}

export default HeroVisiteur