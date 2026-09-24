import GradeScale, { GradeScales, GradeScalesTypes, Tuple } from './GradeScale'
import { scales } from './scales'
import { convertIRCRAGrade } from './ircra-conversion'

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
 * @deprecated Replace with individual grade scale's getScore
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
 * @deprecated Replace with individual grade scale's getScore
 * @param grade grade based on grade scale type
 * @param gradeScaleType grade scale type
 * @returns the average score of the grade for sorting across different scales
 * @throws RangeError for IRCRA, whose reporting numbers use a separate coordinate.
 */
export const getScoreForSort = (grade: string, gradeScaleType: GradeScalesTypes): number => {
  if (gradeScaleType === GradeScales.IRCRA) {
    throw new RangeError('IRCRA reporting scores cannot be compared with Sandbag scores. Convert within the source discipline before sorting.')
  }
  const range = getScore(grade, gradeScaleType)
  return typeof range === 'number' ? range : (range[1] + range[0]) / 2
}

/**
 *
 * @param fromGrade grade based on grade scale type
 * @param fromGradeScaleType grade scale type to convert grade from
 * @param toGradeScaleType grade scale type to convert grade to
 * @remarks Converting to IRCRA returns a reporting value without provenance.
 * Use convertToIRCRA and convertFromIRCRA to retain the source discipline.
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
  if (fromGradeScaleType === GradeScales.IRCRA) {
    return toGradeScaleType === GradeScales.IRCRA
      ? convertIRCRAGrade(fromGrade, fromGradeScaleType, toGradeScaleType)
      : ''
  }
  if (toGradeScaleType === GradeScales.IRCRA) {
    return convertIRCRAGrade(fromGrade, fromGradeScaleType, toGradeScaleType)
  }
  const sameConversionGroup: boolean = fromScale.conversionGroup === toScale.conversionGroup
  if (!sameConversionGroup) {
    console.warn(
      `Scale: ${fromScale.displayName} doesn't support converting to Scale: ${toScale.displayName}`
    )
    return ''
  }
  const toScore = fromScale.getScore(fromGrade)
  return toScale.getGrade(toScore)
}

/** An IRCRA reporting value with the scale from which it was obtained. */
export interface IRCRAResult {
  readonly grade: string
  readonly sourceScale: GradeScalesTypes
}

/** Preserve the source scale so a later conversion can enforce its group. */
export const convertToIRCRA = (grade: string, sourceScale: GradeScalesTypes): IRCRAResult | null => {
  if (sourceScale === GradeScales.IRCRA) return null
  const result = convertIRCRAGrade(grade, sourceScale, GradeScales.IRCRA)
  return result === '' ? null : { grade: result, sourceScale }
}

/** Convert within the recorded source group; a reporting number alone is insufficient. */
export const convertFromIRCRA = (result: IRCRAResult, targetScale: GradeScalesTypes): string => {
  const source = getScale(result.sourceScale)
  const target = getScale(targetScale)
  if (source == null || target == null || source.conversionGroup !== target.conversionGroup) return ''
  // Require a published source column as well as a target column. This also
  // rejects a context whose source is IRCRA itself rather than a local scale.
  if (result.sourceScale === GradeScales.IRCRA ||
      convertIRCRAGrade(result.grade, GradeScales.IRCRA, result.sourceScale) === '') return ''
  const converted = convertIRCRAGrade(result.grade, GradeScales.IRCRA, targetScale)
  // Chart spellings are not always supported by Sandbag's existing parsers.
  // Do not return a value that downstream validation or scoring would reject.
  if (converted === '' || !target.isType(converted)) return ''
  const score = target.getScore(converted)
  if (typeof score === 'number') {
    if (!Number.isFinite(score) || score < 0) return ''
    // The legacy lookup also uses zero when no matching grade was found.
    if (score === 0 && target.getGrade(0).toLowerCase() !== converted.toLowerCase()) return ''
  } else if (score.some(value => !Number.isFinite(value) || value < 0) || score[0] > score[1]) {
    return ''
  }
  return converted
}

/**
 * @deprecated use VScale.isType instead
 */
export const isVScale = (grade: string): boolean => {
  const scale = scales[GradeScales.VSCALE]
  if (scale == null) {
    return false
  }
  return scale.isType(grade)
}
