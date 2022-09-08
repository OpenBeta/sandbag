import boulder from '../data/boulder.json'
import GradeScale, {
  findScoreRange,
  getAvgScore,
  GradeScales,
  Tuple
} from '../GradeScale'

import { Boulder } from '.'
export type FontScaleType = 'fontScale'

const fontGradeRegex = /^([1-9][a-c][+]?){1}(?:(\/)([1-9][a-c][+]?))?$/i
// Supports 1a -> 9c+, slash grades i.e. 5a/5a+ or 6a+/6b
// NOTE: this currently assumes "incorrect" slash grades follows the normal pattern
// i.e. 6b+/5a => 6b+/6c
const isFont = (grade: string): RegExpMatchArray | null =>
  grade.match(fontGradeRegex)

const FontScale: GradeScale = {
  displayName: 'Fontainebleau',
  name: GradeScales.Font,
  offset: 1000,
  isType: (grade: string): boolean => {
    if (isFont(grade) === null) {
      return false
    }
    return true
  },
  getScore: (grade: string): number | Tuple => {
    const parse = isFont(grade)
    if (parse == null) {
      console.warn(`Unexpected grade format: ${grade}`)
      return 0
    }
    const [wholeMatch, basicGrade, slash] = parse
    const basicScore = findScoreRange((b: Boulder) => {
      return b.font === basicGrade
    }, boulder)

    if (wholeMatch !== basicGrade) {
      // 5a/5a+
      if (slash !== null) {
        const slashScore = getAvgScore([basicScore[0], Number.parseInt(basicScore[1], 10) + 2])
        // assumes the slash score is 0.5 higher than the basic grade's max score
        return [slashScore, slashScore]
      }
    }
    return basicScore
  },
  getGrade: (score: number): string => {
    const validateScore = (score: number): number => {
      return Math.min(Math.max(0, score), boulder.length - 1)
    }

    if (Number.isInteger(score)) {
      // retrieves the basic grade
      return boulder[validateScore(score)].font
    }
    const low: string = boulder[validateScore(Math.floor(score))].font
    const high: string = boulder[validateScore(Math.ceil(score))].font
    // retrieves the slash grade
    return `${low}/${high}`
  }
}

export default FontScale
