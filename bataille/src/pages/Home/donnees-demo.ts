import type { EtatCase, EvenementBriefing, ResumeAccueil } from '../../types'

/**
 * TEMPORAIRE — à supprimer dès que l'API du prof est branchée.
 * Sert uniquement à voir la page pendant le développement.
 */

const construireRadar = (tirs: Record<number, EtatCase>): EtatCase[] => {
  const cases: EtatCase[] = Array.from({ length: 100 }, () => 'inconnu')
  for (const [index, etat] of Object.entries(tirs)) {
    cases[Number(index)] = etat
  }
  return cases
}

export const partiesDemo: ResumeAccueil[] = [
  {
    id: '1',
    adversaire: 'Emerick',
    tourDe: 'moi',
    resume: 'Il touche votre croiseur en D4.',
    echeance: 'expire dans 3 h 12',
    urgent: true,
    radar: construireRadar({ 12: 'rate', 13: 'touche', 14: 'touche', 23: 'coule', 24: 'coule', 35: 'rate', 47: 'rate', 56: 'touche', 68: 'rate', 71: 'rate' }),
    dernierTir: 33,
  },
  {
    id: '2',
    adversaire: 'Lina',
    tourDe: 'moi',
    resume: 'Elle manque en J9. Flotte intacte.',
    echeance: 'expire dans 16 h 58',
    urgent: false,
    radar: construireRadar({ 21: 'touche', 31: 'rate', 44: 'rate', 55: 'rate', 66: 'rate', 78: 'rate' }),
    dernierTir: 55,
  },
  {
    id: '3',
    adversaire: 'Théo',
    tourDe: 'adversaire',
    resume: 'Votre tir en G1 a touché — envoyé il y a 2 h.',
    echeance: 'il lui reste 21 h 40',
    urgent: false,
    radar: construireRadar({ 6: 'touche', 11: 'rate', 33: 'rate', 49: 'rate', 60: 'rate' }),
  },
]

export const briefingDemo: EvenementBriefing[] = [
  { id: 'e1', heure: '23:14', texte: 'Emerick a tiré en D4 — votre croiseur est touché.' },
  { id: 'e2', heure: '07:02', texte: 'Lina a tiré en J9 — à l\'eau.' },
  { id: 'e3', heure: '07:03', texte: 'Aucun de vos navires n\'a coulé. Votre flotte tient à 4 navires sur 5.' },
]