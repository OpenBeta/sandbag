import { GradeBandTypes } from './GradeBands'

export type Tuple = [number, number]

export default interface GradeScale {
  /** Return true if the passed string is a valid grade for this scale */
  isType: (grade: string) => boolean
  /** Convert a grade to a difficult score or score range */
  getScore: (grade: string) => number | Tuple
  /** Convert a difficulty score or score range to a grade */
  getGrade: (score: number | Tuple) => string
  /** Return the difficulty band for this grade, e.g. "beginner" */
  getGradeBand: (grade: string) => GradeBandTypes
  /** Human-readable name of this rating scale */
  displayName: string
  /** Slug name of this rating scale */
  name: GradeScalesTypes
  offset: number
  conversionGroup: ConversionGroupsTypes
  /** List of all grades in this scale */
  grades: string[]
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
  NORWEGIAN: 'norwegian',
  BRAZILIAN_CRUX: 'brazilian_crux'
} as const

export type GradeScalesTypes = typeof GradeScales[keyof typeof GradeScales]

export const ConversionGroups = {
  AID: 'aid',
  FREE: 'free',
  BOULDERING: 'bouldering',
  ICE: 'ice'
} as const

export type ConversionGroupsTypes = typeof ConversionGroups[keyof typeof ConversionGroups]

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

/**
 * For getting a whole number/integer tuple of a grade which resides between two adjacent grades.
 * Returns an integer tuple, rounded EXCLUSIVELY of the adjacent grade scores.
 * Related discussion: https://github.com/OpenBeta/sandbag/issues/137
 */
export const getRoundedScoreTuple = (gradeAverage: number, nextGradeAverage: number): Tuple => {
  const low = Math.ceil(Math.min(gradeAverage, nextGradeAverage))
  const high = Math.floor(Math.max(gradeAverage, nextGradeAverage))
  return [low, high]
}
