import assert from 'assert'
import { convertGrade, convertToIRCRA, convertFromIRCRA, IRCRAResult, getScale, getScoreForSort, getAvgScore } from '../index'
import { GradeScales as S, GradeScalesTypes, Tuple } from '../GradeScale'
import { IRCRA, Font, French, VScale } from '../scales'

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
  test.each(chart)('level %s reports YDS %s and French %s with supported reverse notation', (ircra, yds, french) => {
    expect(convertFromIRCRA({ grade: ircra, sourceScale: S.YDS }, S.YDS)).toBe(yds)
    expect(convertGrade(yds, S.YDS, S.IRCRA)).toBe(ircra)
    expect(convertFromIRCRA({ grade: ircra, sourceScale: S.FRENCH }, S.FRENCH)).toBe(Number(ircra) <= 10 ? '' : french)
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
    expect(convertFromIRCRA({ grade: range, sourceScale: S.FONT }, S.YDS)).toBe('')
    expect(convertFromIRCRA({ grade: range, sourceScale: S.FONT }, S.FONT)).toBe('')
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
    expect(convertFromIRCRA({ grade: '20', sourceScale: scale as GradeScalesTypes }, scale as GradeScalesTypes)).toBe('')
  })

  test.each([
    [S.FONT, '9a'], [S.VSCALE, 'V17'], [S.YDS, '5.0'], [S.YDS, '5.15d'],
    [S.FRENCH, '9c'], [S.FRENCH, '1a'], [S.FONT, 'garbage'],
    [S.YDS, '5.12a/5.11a'], [S.FONT, '6a+/6a'], [S.VSCALE, 'V2/V99']
  ])('rejects unavailable or invalid chart grade %s %s', (scale, grade) => {
    expect(convertGrade(grade, scale as GradeScalesTypes, S.IRCRA)).toBe('')
  })

  test('does not invent bouldering grades in empty chart cells', () => {
    expect(convertFromIRCRA({ grade: '1', sourceScale: S.FONT }, S.FONT)).toBe('')
    expect(convertFromIRCRA({ grade: '10', sourceScale: S.VSCALE }, S.VSCALE)).toBe('')
    expect(convertFromIRCRA({ grade: '9/10', sourceScale: S.FONT }, S.FONT)).toBe('')
  })

  test.each(['0', '00', '01', '33', '99', '-1', '15.5', '15+', '15-', '16/15', '0/15', '15/33', '1/2/3', ''])('rejects invalid IRCRA grade %s', grade => {
    const warning = jest.spyOn(console, 'warn').mockImplementation()
    expect(IRCRA.isType(grade)).toBe(false)
    expect(IRCRA.getScore(grade)).toBe(-1)
    expect(IRCRA.getGradeBand(grade)).toBe('unknown')
    expect(convertFromIRCRA({ grade, sourceScale: S.YDS }, S.YDS)).toBe('')
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

describe('IRCRA source discipline', () => {
  test('preserves a route source through a reporting round trip', () => {
    const result = convertToIRCRA('7a', S.FRENCH)
    expect(result).toEqual({ grade: '17', sourceScale: S.FRENCH })
    assert(result !== null)
    expect(convertFromIRCRA(result, S.YDS)).toBe('5.11d')
    expect(convertFromIRCRA(result, S.FRENCH)).toBe('7a')
    expect(convertFromIRCRA(result, S.FONT)).toBe('')
    expect(convertFromIRCRA(result, S.VSCALE)).toBe('')
  })

  test('preserves a bouldering source, including ranges', () => {
    const result = convertToIRCRA('V2', S.VSCALE)
    expect(result).toEqual({ grade: '15/16', sourceScale: S.VSCALE })
    assert(result !== null)
    expect(convertFromIRCRA(result, S.FONT)).toBe('')
    expect(convertFromIRCRA(result, S.FRENCH)).toBe('')
    expect(convertFromIRCRA(result, S.YDS)).toBe('')
  })

  test('equal reporting values retain independent source disciplines after serialization', () => {
    const route: IRCRAResult = JSON.parse(JSON.stringify(convertToIRCRA('7a', S.FRENCH)))
    const boulder: IRCRAResult = JSON.parse(JSON.stringify(convertToIRCRA('6b', S.FONT)))
    expect(route.grade).toBe(boulder.grade)
    expect(convertFromIRCRA(route, S.YDS)).toBe('5.11d')
    expect(convertFromIRCRA(boulder, S.YDS)).toBe('')
    expect(convertFromIRCRA(boulder, S.VSCALE)).toBe('V3')
    expect(convertFromIRCRA(route, S.VSCALE)).toBe('')
  })

  test.each([S.YDS, S.FRENCH, S.FONT, S.VSCALE, S.EWBANK, S.UIAA, S.BRAZILIAN_CRUX, S.AI, S.WI, S.AID])(
    'rejects context-free reporting numbers when converting to %s', target => {
      expect(convertGrade('17', S.IRCRA, target)).toBe('')
      const reportingValue = convertGrade('7a', S.FRENCH, S.IRCRA)
      expect(reportingValue).toBe('17')
      expect(convertGrade(reportingValue, S.IRCRA, target)).toBe('')
    }
  )

  test.each([
    [S.FRENCH, '7a'], [S.YDS, '5.11d'], [S.EWBANK, '23'],
    [S.UIAA, '8'], [S.BRAZILIAN_CRUX, 'VIIc']
  ])('keeps %s in the free-climbing conversion group', (source, grade) => {
    const result = convertToIRCRA(grade, source as GradeScalesTypes)
    assert(result !== null)
    expect(convertFromIRCRA(result, S.YDS)).toBe('5.11d')
    expect(convertFromIRCRA(result, S.FONT)).toBe('')
    expect(convertFromIRCRA(result, S.VSCALE)).toBe('')
  })

  test.each([S.AI, S.WI, S.AID, S.SAXON, S.NORWEGIAN, S.IRCRA])(
    'rejects unsupported source context %s', source => {
      expect(convertToIRCRA('17', source)).toBeNull()
      expect(convertFromIRCRA({ grade: '17', sourceScale: source }, S.FONT)).toBe('')
      expect(convertFromIRCRA({ grade: '17', sourceScale: source }, S.YDS)).toBe('')
      expect(convertFromIRCRA({ grade: '17', sourceScale: source }, source)).toBe('')
    }
  )

  test.each([S.AI, S.WI, S.AID, S.SAXON, S.NORWEGIAN, S.IRCRA])(
    'rejects unsupported target %s even with a known source', target => {
      expect(convertFromIRCRA({ grade: '17', sourceScale: S.FRENCH }, target)).toBe('')
      expect(convertFromIRCRA({ grade: '17', sourceScale: S.FONT }, target)).toBe('')
    }
  )

  test('rejects invalid inputs and does not infer the source from the target', () => {
    expect(convertToIRCRA('invalid', S.FRENCH)).toBeNull()
    expect(convertToIRCRA('V17', S.VSCALE)).toBeNull()
    expect(convertFromIRCRA({ grade: '33', sourceScale: S.FRENCH }, S.YDS)).toBe('')
    expect(convertFromIRCRA({ grade: '17', sourceScale: 'invalid' as GradeScalesTypes }, S.YDS)).toBe('')
  })
})

describe('IRCRA integration with unchanged scale APIs', () => {
  test('rejects chart spellings that existing destination parsers do not support', () => {
    expect(Font.isType('5')).toBe(false)
    expect(French.isType('5+')).toBe(false)
    expect(VScale.isType('V2/V3')).toBe(false)
    expect(convertFromIRCRA({ grade: '14', sourceScale: S.VSCALE }, S.FONT)).toBe('')
    expect(convertFromIRCRA({ grade: '10', sourceScale: S.YDS }, S.FRENCH)).toBe('')
    expect(convertFromIRCRA({ grade: '15/16', sourceScale: S.FONT }, S.VSCALE)).toBe('')
  })

  test('keeps chart notation available for research reporting', () => {
    expect(convertToIRCRA('5', S.FONT)).toEqual({ grade: '14', sourceScale: S.FONT })
    expect(convertToIRCRA('5+', S.FRENCH)).toEqual({ grade: '10', sourceScale: S.FRENCH })
    expect(convertToIRCRA('6A', S.FONT)).toEqual({ grade: '15/16', sourceScale: S.FONT })
  })

  test('rejects chart spellings that the legacy score lookup silently maps to zero', () => {
    expect(convertFromIRCRA({ grade: '4', sourceScale: S.YDS }, S.UIAA)).toBe('')
    expect(convertFromIRCRA({ grade: '17', sourceScale: S.YDS }, S.UIAA)).toBe('8')
  })

  test.each([S.YDS, S.FRENCH, S.FONT, S.VSCALE, S.EWBANK, S.UIAA, S.BRAZILIAN_CRUX])(
    'every returned single-level %s grade is accepted by its unchanged parser', target => {
      const scale = getScale(target)
      assert(scale !== null)
      for (const grade of IRCRA.grades) {
        const converted = convertFromIRCRA({ grade, sourceScale: target }, target)
        if (converted === '') continue
        expect(scale.isType(converted)).toBe(true)
        expect(Array.isArray(scale.getScore(converted))).toBe(true)
      }
    }
  )

  test.each([[S.VSCALE, 'VB/V0-'], [S.FONT, '<2/3']])(
    'rejects %s %s consistently when an interior mapping is missing', (source, grade) => {
      expect(convertToIRCRA(grade, source as GradeScalesTypes)).toBeNull()
      expect(convertGrade(grade, source as GradeScalesTypes, S.IRCRA)).toBe('')
      expect(convertFromIRCRA({ grade: '9/11', sourceScale: source as GradeScalesTypes }, source as GradeScalesTypes)).toBe('')
    }
  )

  test('preserves supported ranges without missing mappings', () => {
    const result = convertToIRCRA('6a/6a+', S.FRENCH)
    assert(result !== null)
    expect(result.grade).toBe('11/12')
    expect(convertFromIRCRA(result, S.FRENCH)).toBe('6a/6a+')
    expect(convertFromIRCRA(result, S.FONT)).toBe('')
  })

  test('rejects comparing native IRCRA reporting numbers with legacy scores', () => {
    expect(() => getScoreForSort('32', S.IRCRA)).toThrow(RangeError)
    expect(() => getScoreForSort('15/16', S.IRCRA)).toThrow('Convert within the source discipline')
    const reported: IRCRAResult = { grade: '32', sourceScale: S.FRENCH }
    const french = convertFromIRCRA(reported, S.FRENCH)
    expect(getScoreForSort(french, S.FRENCH)).toBeGreaterThan(getScoreForSort('6a', S.FRENCH))
    expect(getAvgScore(IRCRA.getScore('32'))).toBeGreaterThan(getAvgScore(IRCRA.getScore('15')))
  })
})
