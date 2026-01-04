import GradeScale, { findScoreRange, getAvgScore, GradeScales, ConversionGroups, Tuple } from '../GradeScale'
import research from '../data/research.json'
import { GradeBandTypes, routeScoreToBand } from '../GradeBands'
import { ResearchGrade } from '.'

const ircraGradeRegex = /^(\d{1,2})$/
const isIRCRA = (grade: string): RegExpMatchArray | null => grade.match(ircraGradeRegex)

const IRCRA_ARRAY = Array.from(new Set(research.map((r) => r.ircra)))

// IRCRA (International Rock Climbing Research Association) grading system
// Uses simple numeric values from 1-32 representing difficulty levels
// This is a relatively new grading system designed to be more precise than traditional systems

const IRCRAScale: GradeScale = {
  displayName: 'IRCRA Scale',
  name: GradeScales.IRCRA,
  grades: IRCRA_ARRAY,
  offset: 3000,
  conversionGroup: ConversionGroups.RESEARCH,
  isType: (grade: string): boolean => {
    if (isIRCRA(grade) === null) {
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
      return Math.min(Math.max(0, validScore), research.length - 1)
    }

    if (typeof score === 'number') {
      return research[validateScore(score)].ircra
    }

    const low: string = research[validateScore(score[0])].ircra
    const high: string = research[validateScore(score[1])].ircra
    if (low === high) return low
    return `${low}/${high}`
  },
  getGradeBand: (grade: string): GradeBandTypes => {
    const score = getScore(grade)
    return routeScoreToBand(getAvgScore(score))
  }
}

const getScore = (grade: string): number | Tuple => {
  const parse = isIRCRA(grade)
  if (parse == null) {
    console.warn(`Unexpected grade format: ${grade} for grade scale IRCRA`)
    return -1
  }
  const [, basicGrade] = parse
  const basicScore = findScoreRange((r: ResearchGrade) => {
    return r.ircra === basicGrade
  }, research)

  return basicScore
}

export default IRCRAScale
