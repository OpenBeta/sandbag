export const GradeBands = {
  UNKNOWN: 'unknown',
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert'
} as const

export type GradeBandTypes = typeof GradeBands[keyof typeof GradeBands]

/**
 *
 * @param score universal grade score
 * @param distribution GradeBandTypes to corresponding scores
 * @returns GradeBandType for passed in score
 */
const scoreToBand = (score: number, distribution: Record<GradeBandTypes, number>): GradeBandTypes => {
  const gradeBands = Object.keys(distribution).sort((a, b) => distribution[b] - distribution[a]) as GradeBandTypes[]
  const gradeBand: GradeBandTypes = gradeBands.find((gradeBand: GradeBandTypes) => distribution[gradeBand] <= score) ?? GradeBands.UNKNOWN
  return gradeBand
}

/**
 *
 * @param score universal grade score
 * @returns GradeBandType for passed in score based on routes
 */
export const routeScoreToBand = (score: number): GradeBandTypes => {
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
export const boulderScoreToBand = (score: number): GradeBandTypes => {
  const distribution = {
    [GradeBands.UNKNOWN]: -1,
    [GradeBands.BEGINNER]: 0,
    [GradeBands.INTERMEDIATE]: 50,
    [GradeBands.ADVANCED]: 60,
    [GradeBands.EXPERT]: 72
  }
  return scoreToBand(score, distribution)
}
