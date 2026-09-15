import Briefing from '../../components/Briefing/Briefing'
import CartePartie from '../../components/CartePartie/CartePartie'
import EtatVide from '../../EtatVide/EtatVide'
import HeroVisiteur from '../../components/HeroVisiteur/HeroVisiteur'
import { briefingDemo, partiesDemo } from './donnees-demo'
import HomeStyles from './Home.module.css'

// ces deux valeurs viendront du Context d'authentification.
const estConnecte = false
const prenom = 'Armel'

const Home = () => {
  const parties = partiesDemo 
  /*const parties: ResumeAccueil[] = []*/
  const evenements = briefingDemo 

  const aJouer = parties.filter((partie) => partie.tourDe === 'moi')
  const enAttente = parties.filter((partie) => partie.tourDe === 'adversaire')

  if (!estConnecte) {
    return <HeroVisiteur />
  }

  return (
    <div className={HomeStyles.accueil}>
      <header className={HomeStyles.entete}>
        <div>
          <h1 className={HomeStyles.titre}>Bon retour, {prenom}.</h1>
          <p className={HomeStyles.sousTitre}>
            {aJouer.length > 0
              ? `${aJouer.length} adversaire${aJouer.length > 1 ? 's' : ''} attend${aJouer.length > 1 ? 'ent' : ''} votre tir.`
              : 'Rien ne vous attend.'}
          </p>
        </div>
      </header>

      <Briefing titre="Rapport de situation · vos 9 dernières heures" evenements={evenements} />

      {aJouer.length > 0 && (
        <section className={HomeStyles.section}>
          <h2 className={HomeStyles.sectionTitre}>À vous de jouer · {aJouer.length}</h2>
          <div className={HomeStyles.parties}>
            {aJouer.map((partie) => (
              <CartePartie key={partie.id} partie={partie} />
            ))}
          </div>
        </section>
      )}

      {enAttente.length > 0 && (
        <section className={HomeStyles.section}>
          <h2 className={HomeStyles.sectionTitre}>En attente de l'adversaire · {enAttente.length}</h2>
          <div className={HomeStyles.parties}>
            {enAttente.map((partie) => (
              <CartePartie key={partie.id} partie={partie} />
            ))}
          </div>
        </section>
      )}

      {aJouer.length === 0 && <EtatVide />}
    </div>
  )
}

export default Home