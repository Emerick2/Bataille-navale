import type { EtatCase } from '../../types'
import MiniRadarStyles from './MiniRadar.module.css'

type MiniRadarProps = {
  cases: EtatCase[]
  dernierTir?: number
}

const MiniRadar = ({ cases, dernierTir }: MiniRadarProps) => {
  return (
    <div className={MiniRadarStyles.radar} role="img" aria-label="Aperçu de la grille adverse">
      {cases.map((etat, index) => {
        const classes = [MiniRadarStyles.cellule, MiniRadarStyles[etat]]
        if (index === dernierTir) {
          classes.push(MiniRadarStyles.dernier)
        }
        return <span key={index} className={classes.join(' ')} />
      })}
    </div>
  )
}

export default MiniRadar