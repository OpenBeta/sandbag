import { GradeBandTypes } from './GradeBands'
import { BOULDER_GRADE_TABLE, ROUTE_GRADE_TABLE, ICE_GRADE_TABLE, AID_GRADE_TABLE } from './data/csvtojson'

export { BOULDER_GRADE_TABLE, ROUTE_GRADE_TABLE, ICE_GRADE_TABLE, AID_GRADE_TABLE }

export type Tuple = [number, number]

export default interface GradeScale {
  isType: (grade: string) => boolean
  getScore: (grade: string) => number | Tuple
  getGrade: (score: number | Tuple) => string
  getGradeBand: (grade: string) => GradeBandTypes
  displayName: string
  name: GradeScalesTypes
  offset: number
  allowableConversionType: GradeScalesTypes[]
}

export const GradeScales = {
  AI: 'ai',
  AID: 'aid',
  WI: 'wi',
  VSCALE: 'vscale',
  YDS: 'yds',
  FONT: 'font',
  FRENCH: 'french',
  UIAA: 'uiaa',
  EWBANK: 'ewbank',
  SAXON: 'saxon',
  NORWEGIAN: 'norwegian'
} as const

export type GradeScalesTypes = typeof GradeScales[keyof typeof GradeScales]

export const findScoreRange = (compareFn, list): number | Tuple => {
  const scores = list.filter(compareFn)
    .map(b => b.score)
    .sort((a, b) => a - b)

  const low = scores[0]
  const high = scores[scores.length - 1]
  if (low === undefined) {
    return 0
  }
  if (high === undefined) {
    return low
  }
  return [low, high]
}
export function getAvgScore (score: number | Tuple): number {
  return typeof score === 'number' ? score : (score[1] + score[0]) / 2
}

