import { getScoreForSort, convertGrade, getScale, getGradeBand, GradeBands } from '../GradeParser'
import { GradeScales } from '../GradeScale'
import { VScale, Font, YosemiteDecimal, French } from '../scales'

describe('Grade Scales', () => {
  beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation()
  })
  beforeEach(() => {
    jest.clearAllMocks()
  })
  describe('YDS', () => {
    test('5.9 > 5.8', () => {
      expect(getScoreForSort('5.9', GradeScales.Yds)).toBeGreaterThan(
        getScoreForSort('5.8', GradeScales.Yds)
      )
    })

    test('5.10b > 5.10a', () => {
      expect(getScoreForSort('5.10b', GradeScales.Yds)).toBeGreaterThan(
        getScoreForSort('5.10a', GradeScales.Yds)
      )
    })

    test('5.11a > 5.10+', () => {
      expect(getScoreForSort('5.11a', GradeScales.Yds)).toBeGreaterThan(
        getScoreForSort('5.10+', GradeScales.Yds)
      )
    })

    test('returns a GradeScale given the name', () => {
      expect(getScale(GradeScales.Yds)).toEqual(YosemiteDecimal)
    })

    test('convert YDS to French', () => {
      expect(convertGrade('5.11a', GradeScales.Yds, GradeScales.French)).toEqual('6b+/6c')
    })

    test('convert YDS to VScale is not allowed', () => {
      expect(convertGrade('5.11a', GradeScales.Yds, GradeScales.VScale)).toEqual('')
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining(
          "Scale: Yosemite Decimal System doesn't support converting to Scale: V Scale"
        )
      )
    })
  })

  describe('V', () => {
    test('v5 > V3', () => {
      expect(getScoreForSort('v5', GradeScales.VScale)).toBeGreaterThan(
        getScoreForSort('V3', GradeScales.VScale)
      )
    })

    test('v2-3 > V2', () => {
      expect(getScoreForSort('v2-3', GradeScales.VScale)).toBeGreaterThan(
        getScoreForSort('V2', GradeScales.VScale)
      )
    })

    test('v3 > V2-3', () => {
      expect(getScoreForSort('v3', GradeScales.VScale)).toBeGreaterThan(
        getScoreForSort('V2-3', GradeScales.VScale)
      )
    })

    test('v20+ > V20', () => {
      expect(getScoreForSort('V20+', GradeScales.VScale)).toBeGreaterThan(
        getScoreForSort('V20', GradeScales.VScale)
      )
    })

    test('returns a GradeScale given the name', () => {
      expect(getScale(GradeScales.VScale)).toEqual(VScale)
    })

    test('convert VScale to Font', () => {
      expect(convertGrade('v7', GradeScales.VScale, GradeScales.Font)).toEqual('7a+/7b')
    })

    test('convert VScale to YDS is not allowed', () => {
      expect(convertGrade('v5', GradeScales.VScale, GradeScales.Yds)).toEqual('')
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining(
          "Scale: V Scale doesn't support converting to Scale: Yosemite Decimal System"
        )
      )
    })

    test('convert VScale to French is not allowed', () => {
      expect(convertGrade('v5', GradeScales.VScale, GradeScales.French)).toEqual('')
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("Scale: V Scale doesn't support converting to Scale: French Scale")
      )
    })
  })

  describe('Font', () => {
    test('2a > 1a', () => {
      expect(getScoreForSort('2a', GradeScales.Font)).toBeGreaterThan(
        getScoreForSort('1a', GradeScales.Font)
      )
    })

    test('2a+ > 2a', () => {
      expect(getScoreForSort('2a+', GradeScales.Font)).toBeGreaterThan(
        getScoreForSort('2a', GradeScales.Font)
      )
    })

    test('3a/3a+ > 3a', () => {
      expect(getScoreForSort('3a/3a+', GradeScales.Font)).toBeGreaterThan(
        getScoreForSort('3a', GradeScales.Font)
      )
    })

    test('4a > 3a+/4a', () => {
      expect(getScoreForSort('4a', GradeScales.Font)).toBeGreaterThan(
        getScoreForSort('3a+/4a', GradeScales.Font)
      )
    })

    test('returns a GradeScale given the name', () => {
      expect(getScale(GradeScales.Font)).toEqual(Font)
    })

    test('convert Font to VScale', () => {
      expect(convertGrade('3a', GradeScales.Font, GradeScales.VScale)).toEqual('VB+')
    })

    test('convert Font to YDS is not allowed', () => {
      expect(convertGrade('3a', GradeScales.Font, GradeScales.Yds)).toEqual('')
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining(
          "Scale: Fontainebleau doesn't support converting to Scale: Yosemite Decimal System"
        )
      )
    })

    test('convert Font to French is not allowed', () => {
      expect(convertGrade('3a', GradeScales.Font, GradeScales.French)).toEqual('')
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining(
          "Scale: Fontainebleau doesn't support converting to Scale: French Scale"
        )
      )
    })
  })

  describe('French', () => {
    test('2a > 1a', () => {
      expect(getScoreForSort('2a', GradeScales.French)).toBeGreaterThan(
        getScoreForSort('1a', GradeScales.French)
      )
    })

    test('2a+ > 2a', () => {
      expect(getScoreForSort('2a+', GradeScales.French)).toBeGreaterThan(
        getScoreForSort('2a', GradeScales.French)
      )
    })

    test('3a/3a+ > 3a', () => {
      expect(getScoreForSort('3a/3a+', GradeScales.French)).toBeGreaterThan(
        getScoreForSort('3a', GradeScales.French)
      )
    })

    test('4a > 3a+/4a', () => {
      expect(getScoreForSort('4a', GradeScales.French)).toBeGreaterThan(
        getScoreForSort('3a+/4a', GradeScales.French)
      )
    })

    test('returns a GradeScale given the name', () => {
      expect(getScale(GradeScales.French)).toEqual(French)
    })

    test('convert French to YDS', () => {
      expect(convertGrade('3a', GradeScales.French, GradeScales.Yds)).toEqual('5.3')
    })

    test('convert French to Font is not allowed', () => {
      expect(convertGrade('3a', GradeScales.French, GradeScales.Font)).toEqual('')
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining(
          "Scale: French Scale doesn't support converting to Scale: Fontainebleau"
        )
      )
    })

    test('convert French to VScale is not allowed', () => {
      expect(convertGrade('3a', GradeScales.French, GradeScales.VScale)).toEqual('')
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("Scale: French Scale doesn't support converting to Scale: V Scale")
      )
    })
  })
})

describe('GradeBands', () => {
  test('returns grade band based on grade and grade scale type', () => {
    expect(getGradeBand('v0', GradeScales.VScale)).toEqual(GradeBands.BEGINNER)
    expect(getGradeBand('v2', GradeScales.VScale)).toEqual(GradeBands.INTERMEDIATE)
    expect(getGradeBand('v5', GradeScales.VScale)).toEqual(GradeBands.ADVANCED)
    expect(getGradeBand('v7', GradeScales.VScale)).toEqual(GradeBands.EXPERT)

    expect(getGradeBand('5.9', GradeScales.Yds)).toEqual(GradeBands.INTERMEDIATE)
    expect(getGradeBand('7a', GradeScales.Font)).toEqual(GradeBands.EXPERT)
    expect(getGradeBand('7a', GradeScales.French)).toEqual(GradeBands.ADVANCED)
  })
  test('returns unknown gradeband if grade and grade scale type are mismatched', () => {
    expect(getGradeBand('5.9', GradeScales.VScale)).toEqual(GradeBands.UNKNOWN)
  })
})
