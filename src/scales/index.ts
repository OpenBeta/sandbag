import { GradeBandTypes } from '../GradeBands'
import VScale from './v'
import YosemiteDecimal from './yds'
import Font from './font'
import French from './french'
import Ewbank from './ewbank'
import Saxon from './saxon'
import Norwegian from './norwegian'
import AI from './ai'
import WI from './wi'
import UIAA from './uiaa'
import GradeScale, { GradeScales } from '../GradeScale'
export { VScale, Font, YosemiteDecimal, French, Saxon, UIAA, Ewbank, AI, WI, Norwegian }

export interface Boulder {
  score: number
  v: string
  font: string
  band: GradeBandTypes
}

export interface Route {
  score: number
  yds: string
  french: string
  uiaa: string
  ewbank: string
  saxon: string
  norwegian: string
  band: GradeBandTypes
}

export interface IceGrade {
  score: number
  ai: string
  wi: string
}

export const scales: Record<
  typeof GradeScales[keyof typeof GradeScales],
GradeScale | null
> = {
  [GradeScales.VSCALE]: VScale,
  [GradeScales.YDS]: YosemiteDecimal,
  [GradeScales.FONT]: Font,
  [GradeScales.FRENCH]: French,
  [GradeScales.UIAA]: UIAA,
  [GradeScales.EWBANK]: Ewbank,
  [GradeScales.SAXON]: Saxon,
  [GradeScales.NORWEGIAN]: Norwegian,
  [GradeScales.AI]: AI,
  [GradeScales.WI]: WI
}
