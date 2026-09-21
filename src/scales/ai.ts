import GradeScale, { findScoreRange, getAvgScore, GradeScales, ConversionGroups, Tuple } from '../GradeScale'
import iceTable from '../data/ice.json'
import { IceGrade } from '.'
import { GradeBandTypes, routeScoreToBand } from '../GradeBands'

const AI_ARRAY = Array.from(new Set(iceTable.map((r) => r.ai)))

// Supports AI1 -> AI13, aith + grades on AI3 -> AI13 and no slash grades
// https://en.aikipedia.org/aiki/Grade_(climbing)#Ice_and_mixed_climbing
const aiGradeRegex = /^(AI)([1-2]|[3-9]\+?|1[0-3]\+?)$/

const isAI = (grade: string): RegExpMatchArray | null => grade.match(aiGradeRegex)

const AIScale: GradeScale = {
  displayName: 'AI Grade',
  name: GradeScales.AI,
  grades: AI_ARRAY,
  offset: 1000,
  conversionGroup: ConversionGroups.ICE,
  isType: (grade: string): boolean => {
    if (isAI(grade) === null) {
      return false
    }
    return true
  },
  getScore: (grade: string): number | Tuple => {
    return getScore(grade)
  },
  getGrade: (score: number | Tuple): string => {
    const validateScore = (score: number): number => {
      const validScore = Number.isInteger(score) ? score : Math.ceil(score)
      return Math.min(Math.max(0, validScore), iceTable.length - 1)
    }

    if (typeof score === 'number') {
      return iceTable[validateScore(score)].ai
    }

    const low: string = iceTable[validateScore(score[0])].ai
    const high: string = iceTable[validateScore(score[1])].ai
    if (low === high) return low
    return `${low}/${high}`
  },
  getGradeBand: (grade: string): GradeBandTypes => {
    const score = getScore(grade)
    return routeScoreToBand(getAvgScore(score))
  }
}

const getScore = (grade: string): number | Tuple => {
  const parse = isAI(grade)
  if (parse == null) {
    console.warn(`Unexpected grade format: ${grade} for grade scale AI`)
    return -1
  }
  const [wholeMatch, prefix, gradeNum] = parse // eslint-disable-line @typescript-eslint/no-unused-vars

  const score = findScoreRange((r: IceGrade) => {
    return r.ai === (wholeMatch)
  }, iceTable)

  return score
}

export default AIScale
