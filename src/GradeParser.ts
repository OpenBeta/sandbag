import GradeScale, { GradeScales, Tuple } from './GradeScale'
import { VScale, YosemiteDecimal, Font, French } from './scales'

const scales: Record<GradeScales, GradeScale | null> = {
  [GradeScales.VScale]: VScale,
  [GradeScales.Yds]: YosemiteDecimal,
  [GradeScales.Font]: Font,
  [GradeScales.French]: French
}

/**
 *
 * @param scaleName
 * @returns grade scale of provided grade scale name
 */
export const getScale = (scaleName: GradeScales): GradeScale | null => {
  const scale = scales[scaleName]
  if (scale === null) {
    console.warn(`Scale: ${scaleName} isn't currently supported`)
  }
  return scale
}

/**
 *
 * @param grade
 * @param scaleName
 * @returns  the score range, allows us to show the range of overlap for other grading systems
 */
export const getScore = (grade: string, scaleName: GradeScales): number | Tuple => {
  const scale = getScale(scaleName)
  if (scale === null) {
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
 * @param fromGrade
 * @param fromType
 * @param toType
 * @returns A scale's grade converted to a different scale's grade
 */
export const convertGrade = (
  fromGrade: string,
  fromType: GradeScales,
  toType: GradeScales
): string => {
  const fromScale = getScale(fromType)
  const toScale = getScale(toType)
  if (fromScale === null || toScale === null) {
    return ''
  }
  const checkScaleToConvert: boolean = fromScale.allowableConversionType.includes(toType)
  if (!checkScaleToConvert) {
    console.warn(
      `Scale: ${fromScale.displayName} doesn't support converting to Scale: ${toScale.displayName}`
    )
    return ''
  }
  const toScore = getScore(fromGrade, fromType)
  return toScale.getGrade(toScore)
}

export const isVScale = (grade: string): boolean => {
  const scale = scales[GradeScales.VScale]
  if (scale == null) {
    return false
  }
  return scale.isType(grade)
}
