import { convertGrade } from '../GradeParser'
import { GradeScales as S, GradeScalesTypes, Tuple } from '../GradeScale'
import { IRCRA } from '../scales'

// Independent transcription of the YDS and French columns of the source chart.
// https://ircra.rocks/reporting-grades-in-climbing-research/
const chart = [
  ['1', '5.1', '1'], ['2', '5.2', '2'], ['3', '5.3', '2+'],
  ['4', '5.4', '3-'], ['5', '5.5', '3'], ['6', '5.6', '3+'],
  ['7', '5.7', '4'], ['8', '5.8', '4+'], ['9', '5.9', '5'],
  ['10', '5.10a', '5+'], ['11', '5.10b', '6a'], ['12', '5.10c', '6a+'],
  ['13', '5.10d', '6b'], ['14', '5.11a', '6b+'], ['15', '5.11b', '6c'],
  ['16', '5.11c', '6c+'], ['17', '5.11d', '7a'], ['18', '5.12a', '7a+'],
  ['19', '5.12b', '7b'], ['20', '5.12c', '7b+'], ['21', '5.12d', '7c'],
  ['22', '5.13a', '7c+'], ['23', '5.13b', '8a'], ['24', '5.13c', '8a+'],
  ['25', '5.13d', '8b'], ['26', '5.14a', '8b+'], ['27', '5.14b', '8c'],
  ['28', '5.14c', '8c+'], ['29', '5.14d', '9a'], ['30', '5.15a', '9a+'],
  ['31', '5.15b', '9b'], ['32', '5.15c', '9b+']
]

describe('Published IRCRA conversions', () => {
  test.each(chart)('level %s matches YDS %s and French %s in both directions', (ircra, yds, french) => {
    expect(convertGrade(ircra, S.IRCRA, S.YDS)).toBe(yds)
    expect(convertGrade(yds, S.YDS, S.IRCRA)).toBe(ircra)
    expect(convertGrade(ircra, S.IRCRA, S.FRENCH)).toBe(french)
    expect(convertGrade(french, S.FRENCH, S.IRCRA)).toBe(ircra)
  })

  test.each([
    [S.FONT, '5', '14'], [S.FONT, '6A', '15/16'], [S.FONT, '6A+', '16/17'],
    [S.FONT, '6B', '17'], [S.FONT, '6B+', '18'], [S.FONT, '6C+', '19/20'],
    [S.FONT, '7A', '20'], [S.FONT, '7B', '22'], [S.FONT, '8C+', '32'],
    [S.VSCALE, 'VB', '9'], [S.VSCALE, 'V0-', '11'], [S.VSCALE, 'V0', '12'],
    [S.VSCALE, 'V0+', '13'], [S.VSCALE, 'V1', '14'], [S.VSCALE, 'v2', '15/16'],
    [S.VSCALE, 'V3', '16/17'], [S.VSCALE, 'V8', '22/23'], [S.VSCALE, 'V16', '32'],
    [S.EWBANK, '21', '14'], [S.EWBANK, '22', '15/16'], [S.EWBANK, '38', '32'],
    [S.UIAA, '7', '13/14'], [S.UIAA, '8', '17'], [S.UIAA, '12', '32'],
    [S.BRAZILIAN_CRUX, 'VIIb', '15/16'], [S.BRAZILIAN_CRUX, 'VIIIa', '18'],
    [S.BRAZILIAN_CRUX, 'XIIc', '32']
  ])('%s %s maps to %s, preserving chart overlaps', (scale, grade, ircra) => {
    expect(convertGrade(grade, scale as GradeScalesTypes, S.IRCRA)).toBe(ircra)
  })

  test('uses different mappings for French and Font', () => {
    expect(convertGrade('7a', S.FRENCH, S.IRCRA)).toBe('17')
    expect(convertGrade('7a', S.FONT, S.IRCRA)).toBe('20')
  })

  test('generated ranges can be consumed without falling back to the easiest grade', () => {
    const range = convertGrade('6a', S.FONT, S.IRCRA)
    expect(range).toBe('15/16')
    expect(IRCRA.isType(range)).toBe(true)
    expect(IRCRA.getScore(range)).toEqual([15, 16])
    expect(convertGrade(range, S.IRCRA, S.YDS)).toBe('5.11b/5.11c')
    expect(convertGrade(range, S.IRCRA, S.FONT)).toBe('5+/6a+')
    expect(convertGrade(range, S.IRCRA, S.IRCRA)).toBe(range)
  })

  test('preserves both endpoints of explicit source ranges', () => {
    expect(convertGrade('5.11a/5.12a', S.YDS, S.IRCRA)).toBe('14/18')
    expect(convertGrade('6a/7a', S.FRENCH, S.IRCRA)).toBe('11/17')
    expect(convertGrade('V2/V4', S.VSCALE, S.IRCRA)).toBe('15/18')
    expect(convertGrade('18/18', S.IRCRA, S.IRCRA)).toBe('18')
  })

  test.each([
    [S.AI, 'AI5'], [S.WI, 'WI5'], [S.AID, 'A3'],
    [S.SAXON, '9a'], [S.NORWEGIAN, '7']
  ])('rejects %s in both directions because the chart has no mapping', (scale, grade) => {
    expect(convertGrade(grade, scale as GradeScalesTypes, S.IRCRA)).toBe('')
    expect(convertGrade('20', S.IRCRA, scale as GradeScalesTypes)).toBe('')
  })

  test.each([
    [S.FONT, '9a'], [S.VSCALE, 'V17'], [S.YDS, '5.0'], [S.YDS, '5.15d'],
    [S.FRENCH, '9c'], [S.FRENCH, '1a'], [S.FONT, 'garbage'],
    [S.YDS, '5.12a/5.11a'], [S.FONT, '6a+/6a'], [S.VSCALE, 'V2/V99']
  ])('rejects unavailable or invalid chart grade %s %s', (scale, grade) => {
    expect(convertGrade(grade, scale as GradeScalesTypes, S.IRCRA)).toBe('')
  })

  test('does not invent bouldering grades in empty chart cells', () => {
    expect(convertGrade('1', S.IRCRA, S.FONT)).toBe('')
    expect(convertGrade('10', S.IRCRA, S.VSCALE)).toBe('')
    expect(convertGrade('9/11', S.IRCRA, S.FONT)).toBe('')
  })

  test.each(['0', '00', '01', '33', '99', '-1', '15.5', '15+', '15-', '16/15', '0/15', '15/33', '1/2/3', ''])('rejects invalid IRCRA grade %s', grade => {
    const warning = jest.spyOn(console, 'warn').mockImplementation()
    expect(IRCRA.isType(grade)).toBe(false)
    expect(IRCRA.getScore(grade)).toBe(-1)
    expect(IRCRA.getGradeBand(grade)).toBe('unknown')
    expect(convertGrade(grade, S.IRCRA, S.YDS)).toBe('')
    expect(convertGrade(grade, S.IRCRA, S.IRCRA)).toBe('')
    warning.mockRestore()
  })

  test.each<number | Tuple>([-1, NaN, Infinity, [16, 15], [-1, 15], [1, Infinity]])('rejects invalid IRCRA score %j', score => {
    expect(IRCRA.getGrade(score)).toBe('')
  })

  test('preserves every valid IRCRA level through its score', () => {
    for (const grade of IRCRA.grades) expect(IRCRA.getGrade(IRCRA.getScore(grade))).toBe(grade)
  })
})
