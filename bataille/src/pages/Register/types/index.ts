/** Ce qu'on sait d'une case de la grille adverse. */
export type EtatCase = 'inconnu' | 'rate' | 'touche' | 'coule'

/** À qui le tour. */
export type TourDe = 'moi' | 'adversaire'

/** Une partie telle que la page d'accueil a besoin de l'afficher. */
export type ResumeAccueil = {
  id: string
  adversaire: string
  tourDe: TourDe
  resume: string
  echeance: string
  urgent: boolean
  radar: EtatCase[]
  dernierTir?: number
}

/** Une ligne du rapport de situation. */
export type EvenementBriefing = {
  id: string
  heure: string
  texte: string
}