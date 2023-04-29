import { getScoreForSort, convertGrade, getScale } from '../GradeParser'
import { GradeScales } from '../GradeScale'
import { VScale, Font, YosemiteDecimal, French, Saxon } from '../scales'

describe('Grade Scales', () => {
  beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation()
  })
  beforeEach(() => {
    jest.clearAllMocks()
  })
  describe('YDS', () => {
    test('5.9 > 5.8', () => {
      expect(getScoreForSort('5.9', GradeScales.YDS)).toBeGreaterThan(
        getScoreForSort('5.8', GradeScales.YDS)
      )
    })

    test('5.10b > 5.10a', () => {
      expect(getScoreForSort('5.10b', GradeScales.YDS)).toBeGreaterThan(
        getScoreForSort('5.10a', GradeScales.YDS)
      )
    })

    test('5.11a > 5.10+', () => {
      expect(getScoreForSort('5.11a', GradeScales.YDS)).toBeGreaterThan(
        getScoreForSort('5.10+', GradeScales.YDS)
      )
    })

    test('returns a GradeScale given the name', () => {
      expect(getScale(GradeScales.YDS)).toEqual(YosemiteDecimal)
    })

    test('convert YDS to FRENCH', () => {
      expect(convertGrade('5.11a', GradeScales.YDS, GradeScales.FRENCH)).toEqual('6b+/6c')
    })

    test('convert YDS to Ewbank', () => {
      expect(convertGrade('5.11a', GradeScales.YDS, GradeScales.EWBANK)).toEqual('21')
    })

    xtest('convert YDS to Ewbank where range coverages more than 2 grades', () => {
      expect(convertGrade('5.0', GradeScales.YDS, GradeScales.EWBANK)).toEqual('1-4')
    })

    test('convert YDS to VSCALE is not allowed', () => {
      expect(convertGrade('5.11a', GradeScales.YDS, GradeScales.VSCALE)).toEqual('')
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining(
          "Scale: Yosemite Decimal System doesn't support converting to Scale: V Scale"
        )
      )
    })
  })

  describe('VSCALE', () => {
    test('v5 > V3', () => {
      expect(getScoreForSort('v5', GradeScales.VSCALE)).toBeGreaterThan(
        getScoreForSort('V3', GradeScales.VSCALE)
      )
    })

    test('v2-3 > V2', () => {
      expect(getScoreForSort('v2-3', GradeScales.VSCALE)).toBeGreaterThan(
        getScoreForSort('V2', GradeScales.VSCALE)
      )
    })

    test('v3 > V2-3', () => {
      expect(getScoreForSort('v3', GradeScales.VSCALE)).toBeGreaterThan(
        getScoreForSort('V2-3', GradeScales.VSCALE)
      )
    })

    test('v20+ > V20', () => {
      expect(getScoreForSort('V20+', GradeScales.VSCALE)).toBeGreaterThan(
        getScoreForSort('V20', GradeScales.VSCALE)
      )
    })

    test('returns a GradeScale given the name', () => {
      expect(getScale(GradeScales.VSCALE)).toEqual(VScale)
    })

    test('convert VSCALE to FONT', () => {
      expect(convertGrade('v7', GradeScales.VSCALE, GradeScales.FONT)).toEqual('7a+/7b')
    })

    test('convert VSCALE to YDS is not allowed', () => {
      expect(convertGrade('v5', GradeScales.VSCALE, GradeScales.YDS)).toEqual('')
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining(
          "Scale: V Scale doesn't support converting to Scale: Yosemite Decimal System"
        )
      )
    })

    test('convert VSCALE to FRENCH is not allowed', () => {
      expect(convertGrade('v5', GradeScales.VSCALE, GradeScales.FRENCH)).toEqual('')
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("Scale: V Scale doesn't support converting to Scale: French Scale")
      )
    })
  })

  describe('FONT', () => {
    test('2a > 1a', () => {
      expect(getScoreForSort('2a', GradeScales.FONT)).toBeGreaterThan(
        getScoreForSort('1a', GradeScales.FONT)
      )
    })

    test('2a+ > 2a', () => {
      expect(getScoreForSort('2a+', GradeScales.FONT)).toBeGreaterThan(
        getScoreForSort('2a', GradeScales.FONT)
      )
    })

    test('3a/3a+ > 3a', () => {
      expect(getScoreForSort('3a/3a+', GradeScales.FONT)).toBeGreaterThan(
        getScoreForSort('3a', GradeScales.FONT)
      )
    })

    test('4a > 3a+/4a', () => {
      expect(getScoreForSort('4a', GradeScales.FONT)).toBeGreaterThan(
        getScoreForSort('3a+/4a', GradeScales.FONT)
      )
    })

    test('returns a GradeScale given the name', () => {
      expect(getScale(GradeScales.FONT)).toEqual(Font)
    })

    test('convert FONT to VSCALE', () => {
      expect(convertGrade('3a', GradeScales.FONT, GradeScales.VSCALE)).toEqual('VB+')
    })

    test('convert FONT to YDS is not allowed', () => {
      expect(convertGrade('3a', GradeScales.FONT, GradeScales.YDS)).toEqual('')
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining(
          "Scale: Fontainebleau doesn't support converting to Scale: Yosemite Decimal System"
        )
      )
    })

    test('convert FONT to FRENCH is not allowed', () => {
      expect(convertGrade('3a', GradeScales.FONT, GradeScales.FRENCH)).toEqual('')
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining(
          "Scale: Fontainebleau doesn't support converting to Scale: French Scale"
        )
      )
    })
  })

  describe('FRENCH', () => {
    test('2a > 1a', () => {
      expect(getScoreForSort('2a', GradeScales.FRENCH)).toBeGreaterThan(
        getScoreForSort('1a', GradeScales.FRENCH)
      )
    })

    test('2a+ > 2a', () => {
      expect(getScoreForSort('2a+', GradeScales.FRENCH)).toBeGreaterThan(
        getScoreForSort('2a', GradeScales.FRENCH)
      )
    })

    test('3a/3a+ > 3a', () => {
      expect(getScoreForSort('3a/3a+', GradeScales.FRENCH)).toBeGreaterThan(
        getScoreForSort('3a', GradeScales.FRENCH)
      )
    })

    test('4a > 3a+/4a', () => {
      expect(getScoreForSort('4a', GradeScales.FRENCH)).toBeGreaterThan(
        getScoreForSort('3a+/4a', GradeScales.FRENCH)
      )
    })

    test('returns a GradeScale given the name', () => {
      expect(getScale(GradeScales.FRENCH)).toEqual(French)
    })

    test('convert FRENCH to YDS', () => {
      expect(convertGrade('3a', GradeScales.FRENCH, GradeScales.YDS)).toEqual('5.3')
    })

    test('convert FRENCH to Ewbank', () => {
      expect(convertGrade('4b', GradeScales.FRENCH, GradeScales.EWBANK)).toEqual('13/14')
    })

    test('convert FRENCH to FONT is not allowed', () => {
      expect(convertGrade('3a', GradeScales.FRENCH, GradeScales.FONT)).toEqual('')
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining(
          "Scale: French Scale doesn't support converting to Scale: Fontainebleau"
        )
      )
    })

    test('convert FRENCH to VSCALE is not allowed', () => {
      expect(convertGrade('3a', GradeScales.FRENCH, GradeScales.VSCALE)).toEqual('')
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("Scale: French Scale doesn't support converting to Scale: V Scale")
      )
    })
  })

  describe('SAXON', () => {
    test('6 > 5', () => {
      expect(getScoreForSort('6', GradeScales.SAXON)).toBeGreaterThan(
        getScoreForSort('5', GradeScales.SAXON)
      )
    })

    test('7b > 7a', () => {
      expect(getScoreForSort('7b', GradeScales.SAXON)).toBeGreaterThan(
        getScoreForSort('7a', GradeScales.SAXON)
      )
    })

    test('7c > 7b', () => {
      expect(getScoreForSort('7c', GradeScales.SAXON)).toBeGreaterThan(
        getScoreForSort('7b', GradeScales.SAXON)
      )
    })

    test('8a > 7c', () => {
      expect(getScoreForSort('8a', GradeScales.SAXON)).toBeGreaterThan(
        getScoreForSort('7c', GradeScales.SAXON)
      )
    })

    test('returns a GradeScale given the name', () => {
      expect(getScale(GradeScales.SAXON)).toEqual(Saxon)
    })

    test('convert SAXON to YDS', () => {
      expect(convertGrade('7a', GradeScales.SAXON, GradeScales.YDS)).toEqual('5.8/5.9')
    })

    test('convert SAXON to Ewbank', () => {
      expect(convertGrade('5', GradeScales.SAXON, GradeScales.EWBANK)).toEqual('13/15')
    })

    test('convert SAXON to FONT is not allowed', () => {
      expect(convertGrade('3a', GradeScales.SAXON, GradeScales.FONT)).toEqual('')
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining(
          "Scale: Saxon Scale doesn't support converting to Scale: Fontainebleau"
        )
      )
    })

    test('convert SAXON to VSCALE is not allowed', () => {
      expect(convertGrade('3a', GradeScales.SAXON, GradeScales.VSCALE)).toEqual('')
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("Scale: Saxon Scale doesn't support converting to Scale: V Scale")
      )
    })
  })
})
