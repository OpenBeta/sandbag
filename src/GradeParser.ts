
import GradeScale, { GradeScales, Tuple } from './GradeScale'
import { VScale, YosemiteDecimal, Font, French } from './scales'

const scales: Record<GradeScales, GradeScale | null> = {
  [GradeScales.VScale]: VScale,
  [GradeScales.Yds]: YosemiteDecimal,
  [GradeScales.Font]: Font,
  [GradeScales.French]: French
}

/**
 * Returns the score range, allows us to show the range of overlap for other grading systems
 */
export const getScore = (grade: string, scaleName: GradeScales): number | Tuple => {
  const scale = scales[scaleName]
  if (scale == null) {
    console.warn(`Scale: ${scaleName} isn't currently supported`)
    return 0
  }
  return scale.getScore(grade)
}

/**
 * @param grade
 * @param type
 * @returns the average score of the grade for sorting across different scales
 */
export const getScoreForSort = (grade: string, type: GradeScales): number => {
  const range = getScore(grade, type)
  return typeof range === 'number' ? range : (range[1] + range[0]) / 2
}

/**
 *
 * @param grade
 * @param fromType
 * @param toType
 * @returns
 */
export const convert = (grade: string, fromType: GradeScales, toType: GradeScales): string => {
  const score = getScore(grade, fromType)
  switch (toType) {
    case GradeScales.Yds:
      return YosemiteDecimal.getGrade(score)
    case GradeScales.VScale:
      return VScale.getGrade(score)
    case GradeScales.Font:
      return Font.getGrade(score)
    case GradeScales.French:
      return French.getGrade(score)
    default:
      return 'unknown'
  }
}

export const isVScale = (grade: string): boolean => {
  const scale = scales[GradeScales.VScale]
  if (scale == null) {
    return false
  }
  return scale.isType(grade)
}
