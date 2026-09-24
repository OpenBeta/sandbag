import { GradeScales, GradeScalesTypes, Tuple } from './GradeScale'
import research from './data/research.json'
import { parseIRCRA } from './scales/ircra'

// Source: https://ircra.rocks/wp-content/uploads/2024/06/image-1.png (levels 1-32).
const chartScales = [
  GradeScales.YDS, GradeScales.FRENCH, GradeScales.FONT, GradeScales.VSCALE,
  GradeScales.EWBANK, GradeScales.UIAA, GradeScales.BRAZILIAN_CRUX
] as const

type ChartScale = typeof chartScales[number]
const isChartScale = (scale: GradeScalesTypes): scale is ChartScale => chartScales.some(value => value === scale)
const entries = (cell: string): string[] => cell === '' ? [] : cell.split('|')
const normalize = (grade: string): string => grade.toLowerCase()

const chartRange = (grade: string, scale: ChartScale): Tuple | null => {
  const lookup = (value: string): Tuple | null => {
    const matches = research.filter(row => entries(row[scale]).some(entry => normalize(entry) === normalize(value)))
    return matches.length === 0 ? null : [matches[0].score, matches[matches.length - 1].score]
  }
  const exact = lookup(grade)
  if (exact !== null) return exact
  const parts = grade.split('/')
  if (parts.length !== 2) return null
  const low = lookup(parts[0])
  const high = lookup(parts[1])
  if (low === null || high === null || low[0] > high[0] || low[1] > high[1]) return null
  return [low[0], high[1]]
}

/** Convert only published chart grades; never extrapolate an unsupported grade. */
export const convertIRCRAGrade = (grade: string, from: GradeScalesTypes, to: GradeScalesTypes): string => {
  if (from !== GradeScales.IRCRA && !isChartScale(from)) return ''
  if (to !== GradeScales.IRCRA && !isChartScale(to)) return ''
  const range = from === GradeScales.IRCRA ? parseIRCRA(grade) : chartRange(grade, from)
  if (range === null) return ''
  if (to === GradeScales.IRCRA) {
    return range[0] === range[1] ? `${range[0]}` : `${range[0]}/${range[1]}`
  }
  const rows = research.slice(range[0] - 1, range[1])
  // A missing cell is not a beginner grade. Require coverage of the whole range.
  if (rows.some(row => row[to] === '')) return ''
  const grades = Array.from(new Set(rows.flatMap(row => entries(row[to]))))
  const low = grades[0]
  const high = grades[grades.length - 1]
  return low === high ? low : `${low}/${high}`
}
