import GradeScale, { GradeScales, GradeScalesTypes, Tuple } from './GradeScale'
import { VScale, YosemiteDecimal, Font, French } from './scales'

const scales: Record<typeof GradeScales[keyof typeof GradeScales], GradeScale | null> = {
  [GradeScales.VSCALE]: VScale,
  [GradeScales.YDS]: YosemiteDecimal,
  [GradeScales.FONT]: Font,
  [GradeScales.FRENCH]: French
}

/**
 *
 * @param gradeScaleType grade scale type
 * @returns grade scale of provided grade scale name
 */
export const getScale = (gradeScaleType: GradeScalesTypes): GradeScale | null => {
  const scale = scales[gradeScaleType]
  if (scale === null) {
    console.warn(`Scale: ${gradeScaleType} isn't currently supported`)
  }
  return scale
}

/**
 *
 * @param grade grade based on grade scale type
 * @param gradeScaleType grade scale type
 * @returns  the score range, allows us to show the range of overlap for other grading systems
 */
export const getScore = (grade: string, gradeScaleType: GradeScalesTypes): number | Tuple => {
  const scale = getScale(gradeScaleType)
  if (scale === null) {
    return -1
  }
  return scale.getScore(grade)
}

/**
 * @param grade grade based on grade scale type
 * @param gradeScaleType grade scale type
 * @returns the average score of the grade for sorting across different scales
 */
export const getScoreForSort = (grade: string, gradeScaleType: GradeScalesTypes): number => {
  const range = getScore(grade, gradeScaleType)
  return typeof range === 'number' ? range : (range[1] + range[0]) / 2
}

/**
 *
 * @param fromGrade grade based on grade scale type
 * @param fromGradeScaleType grade scale type to convert grade from
 * @param toGradeScaleType grade scale type to convert grade to
 * @returns A scale's grade converted to a different scale's grade
 */
export const convertGrade = (
  fromGrade: string,
  fromGradeScaleType: GradeScalesTypes,
  toGradeScaleType: GradeScalesTypes
): string => {
  const fromScale = getScale(fromGradeScaleType)
  const toScale = getScale(toGradeScaleType)
  if (fromScale === null || toScale === null) {
    return ''
  }
  const checkScaleToConvert: boolean = fromScale.allowableConversionType.includes(toGradeScaleType)
  if (!checkScaleToConvert) {
    console.warn(
      `Scale: ${fromScale.displayName} doesn't support converting to Scale: ${toScale.displayName}`
    )
    return ''
  }
  const toScore = getScore(fromGrade, fromGradeScaleType)
  return toScale.getGrade(toScore)
}

export const isVScale = (grade: string): boolean => {
  const scale = scales[GradeScales.VSCALE]
  if (scale == null) {
    return false
  }
  return scale.isType(grade)
}

export const GradeBands = {
  UNKNOWN: 'unknown',
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert'
} as const

type GradeBandTypes = typeof GradeBands[keyof typeof GradeBands]

/**
 * Convert grade to band
 * @param grade grade based on grade scale type
 * @param gradeScaleType grade scale type
 * @returns GradeBand
 */

export const getGradeBand = (grade: string, gradeScaleType: GradeScalesTypes): string => {
  const score = getScoreForSort(grade, gradeScaleType)
  const scale = getScale(gradeScaleType)
  if (scale === null) {
    return GradeBands.UNKNOWN
  }
  return scale.getGradeBand(score)
}

/**
 *
 * @param score universal grade score
 * @param distribution GradeBandTypes to corresponding scores
 * @returns GradeBandType for passed in score
 */
const scoreToBand = (score: number, distribution: Record<Exclude<GradeBandTypes, 'unknown'>, number>): string => {
  const gradeBands = Object.keys(distribution).sort((a, b) => distribution[b] - distribution[a])
  const gradeBand = gradeBands.find(gradeBand => distribution[gradeBand] <= score)
  if (gradeBand === undefined) {
    return GradeBands.UNKNOWN
  }
  return gradeBand
}

/**
 *
 * @param score universal grade score
 * @returns GradeBandType for passed in score based on routes
 */
export const routeScoreToBand = (score: number): string => {
  const distribution = {
    [GradeBands.UNKNOWN]: -1,
    [GradeBands.BEGINNER]: 0,
    [GradeBands.INTERMEDIATE]: 54,
    [GradeBands.ADVANCED]: 67.5,
    [GradeBands.EXPERT]: 82.5
  }
  return scoreToBand(score, distribution)
}

/**
 *
 * @param score universal grade score
 * @returns GradeBandType for passed in score based on bouldering
 */
export const boulderScoreToBand = (score: number): string => {
  const distribution = {
    [GradeBands.UNKNOWN]: -1,
    [GradeBands.BEGINNER]: 0,
    [GradeBands.INTERMEDIATE]: 50,
    [GradeBands.ADVANCED]: 60,
    [GradeBands.EXPERT]: 72
  }
  return scoreToBand(score, distribution)
}
