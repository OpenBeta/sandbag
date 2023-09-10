import VScale from './v'
import YosemiteDecimal from './yds'
import Font from './font'
import French from './french'
import Ewbank from './ewbank'
import Saxon from './saxon'
import Norwegian from './norwegian'
import AI from './ai'
import Aid from './aid'
import WI from './wi'
import UIAA from './uiaa'
import { GradeScales } from '../GradeScale'
export { Aid, VScale, Font, YosemiteDecimal, French, Saxon, UIAA, Ewbank, AI, WI, Norwegian }

export interface Boulder {
  score: number
  v: string
  font: string
}

export interface Route {
  score: number
  yds: string
  french: string
  uiaa: string
  ewbank: string
  saxon: string
  norwegian: string
}

export interface IceGrade {
  score: number
  ai: string
  wi: string
}

export interface AidGrade {
  score: number
  aid: string
}

export const scales = {
  [GradeScales.VSCALE]: VScale,
  [GradeScales.YDS]: YosemiteDecimal,
  [GradeScales.FONT]: Font,
  [GradeScales.FRENCH]: French,
  [GradeScales.UIAA]: UIAA,
  [GradeScales.EWBANK]: Ewbank,
  [GradeScales.SAXON]: Saxon,
  [GradeScales.NORWEGIAN]: Norwegian,
  [GradeScales.AI]: AI,
  [GradeScales.WI]: WI,
  [GradeScales.AID]: Aid
} as const
