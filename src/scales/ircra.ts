import GradeScale, { getAvgScore, GradeScales, ConversionGroups, Tuple } from '../GradeScale'
import research from '../data/research.json'
import { GradeBandTypes, routeScoreToBand } from '../GradeBands'
import YosemiteDecimal from './yds'

const IRCRA_ARRAY = research.map((row) => row.ircra)

/** Parse a published IRCRA level or an ascending, inclusive range of levels. */
export const parseIRCRA = (grade: string): Tuple | null => {
  const match = /^([1-9]|[12]\d|3[0-2])(?:\/([1-9]|[12]\d|3[0-2]))?$/.exec(grade)
  if (match === null) return null
  const low = Number(match[1])
  const high = Number(match[2] ?? match[1])
  return low <= high ? [low, high] : null
}

// IRCRA scores use the published 1-32 coordinate, independently of Sandbag's
// route/boulder scores. GradeParser uses the chart for conversions between them.
const IRCRAScale: GradeScale = {
  displayName: 'IRCRA Scale',
  name: GradeScales.IRCRA,
  grades: IRCRA_ARRAY,
  offset: 3000,
  conversionGroup: ConversionGroups.RESEARCH,
  isType: (grade: string): boolean => parseIRCRA(grade) !== null,
  getScore: (grade: string): number | Tuple => {
    const range = parseIRCRA(grade)
    if (range === null) {
      console.warn(`Unexpected grade format: ${grade} for grade scale IRCRA`)
      return -1
    }
    return range
  },
  getGrade: (score: number | Tuple): string => {
    const [low, high] = typeof score === 'number' ? [score, score] : score
    if (!Number.isFinite(low) || !Number.isFinite(high) || low < 0 || low > high) return ''
    const clamp = (value: number): number => Math.min(32, Math.max(1, Math.ceil(value)))
    return clamp(low) === clamp(high) ? `${clamp(low)}` : `${clamp(low)}/${clamp(high)}`
  },
  getGradeBand: (grade: string): GradeBandTypes => {
    const range = parseIRCRA(grade)
    if (range === null) return routeScoreToBand(-1)
    // Keep Sandbag's existing bands; these are not IRCRA's sex-specific groups.
    const low = YosemiteDecimal.getScore(research[range[0] - 1].yds)
    const high = YosemiteDecimal.getScore(research[range[1] - 1].yds)
    return routeScoreToBand((getAvgScore(low) + getAvgScore(high)) / 2)
  }
}

export default IRCRAScale
