import type { EvenementBriefing } from '../../types'
import BriefingStyles from './Briefing.module.css'

type BriefingProps = {
  titre: string
  evenements: EvenementBriefing[]
}

const Briefing = ({ titre, evenements }: BriefingProps) => {
  if (evenements.length === 0) {
    return null
  }

  return (
    <section className={BriefingStyles.briefing}>
      <h2 className={BriefingStyles.tete}>{titre}</h2>
      <ul className={BriefingStyles.liste}>
        {evenements.map((evenement) => (
          <li key={evenement.id} className={BriefingStyles.ligne}>
            <span className={BriefingStyles.heure}>{evenement.heure}</span>
            <span className={BriefingStyles.texte}>{evenement.texte}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Briefing