import GradeScale, { findScoreRange, getAvgScore, GradeScales, Tuple, getRoundedScoreTuple } from '../GradeScale'
import routes from '../data/routes.json'
import { Route } from '.'
import { GradeBandTypes, routeScoreToBand } from '../GradeBands'

const BRAZILIAN_ARRAY = Array.from(new Set(routes.map((r) => r[GradeScales.BRAZILIAN_CRUX])))

const brazilianGradeRegex = /^((((I|II|III|IV|V|VI)(sup)?)|(VII|VIII|IX|X|XI|XII|XIII|XIV)(a|b|c))(\/(a|b|c))?)((\/(((I|II|III|IV|V|VI)(sup)?)|(VII|VIII|IX|X|XI|XII|XIII|XIV)(a|b|c))))?$/i
const isBrazilianCrux = (grade: string): RegExpMatchArray | null => grade.match(brazilianGradeRegex)

const isABC = (s: string): boolean => s[0] === 'a' || s[0] === 'b' || s[0] === 'c'
const getFullSlashGrade = (grade): string | null => {
  const brokenGrade: string[] = grade.split('/')
  const baseGrade: string = brokenGrade[0]
  const slash: string | undefined = brokenGrade[1]
  if (slash !== undefined) {
    if (isABC(slash[0])) {
      return baseGrade.replace(/a|b|c/i, slash[0])
    }
    return slash
  }
  return null
}

const getNextScore = (s): string | null => BRAZILIAN_ARRAY[BRAZILIAN_ARRAY.indexOf(s) + 1]

const getScore = (grade: string): number | Tuple => {
  const parse = isBrazilianCrux(grade)
  if (parse === null) {
    console.warn(`Unexpected grade format: ${grade} for grade scale BrazilianCrux`)
    return -1
  }

  const wholeMatch = parse[0]
  const basicGrade = parse[2]
  const slashGrade = getFullSlashGrade(wholeMatch)

  const basicScore = findScoreRange((r: Route) => r[GradeScales.BRAZILIAN_CRUX] === basicGrade, routes)

  if (slashGrade !== null && getNextScore(basicGrade) !== slashGrade) {
    console.warn(`Unexpected grade slash not subsequent: ${slashGrade}`)
    return -1
  }

  if (wholeMatch !== basicGrade) {
    // VIIa/b
    let otherGrade
    if (slashGrade !== null) {
      otherGrade = (typeof basicScore === 'number' ? basicScore : basicScore[1]) + 1
    }

    if (otherGrade !== undefined) {
      const nextGrade = findScoreRange(
        (r: Route) => r[GradeScales.BRAZILIAN_CRUX] === routes[otherGrade][GradeScales.BRAZILIAN_CRUX],
        routes
      )
      const basicAvg = getAvgScore(basicScore)
      const nextGradeAvg = getAvgScore(nextGrade)
      const tuple = getRoundedScoreTuple(basicAvg, nextGradeAvg)
      return tuple
    }
  }
  return basicScore
}

// current spec document for brazilian grade:
// https://www.cap.com.br/post/sistema-brasileiro-de-gradua%C3%A7%C3%A3o-de-vias-de-escalada
// alt mirror: https://web.archive.org/web/20220125022634/https://www.cap.com.br/post/sistema-brasileiro-de-gradua%C3%A7%C3%A3o-de-vias-de-escalada
const BrazilianCrux: GradeScale = {
  grades: BRAZILIAN_ARRAY,
  displayName: 'Brazilian Crux Scale',
  name: GradeScales.BRAZILIAN_CRUX,
  offset: 1000,
  allowableConversionType: [GradeScales.YDS, GradeScales.SAXON, GradeScales.EWBANK, GradeScales.FRENCH, GradeScales.NORWEGIAN],
  isType: (grade: string): boolean => isBrazilianCrux(grade) !== null,
  getScore,
  getGrade: (score: number | Tuple): string => {
    const validateScore = (score: number): number => {
      const validScore = Number.isInteger(score) ? score : Math.ceil(score)
      return Math.min(Math.max(0, validScore), routes.length - 1)
    }

    if (typeof score === 'number') {
      return routes[validateScore(score)][GradeScales.BRAZILIAN_CRUX]
    }

    const low: string = routes[validateScore(score[0])][GradeScales.BRAZILIAN_CRUX]
    const high: string = routes[validateScore(score[1])][GradeScales.BRAZILIAN_CRUX]
    if (low === high) return low
    return `${low}/${high}`
  },
  getGradeBand: (grade: string): GradeBandTypes => {
    const score = getScore(grade)
    return routeScoreToBand(getAvgScore(score))
  }
}

export default BrazilianCrux
