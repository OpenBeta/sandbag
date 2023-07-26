import { GradeBands } from '../../GradeBands'
import { YosemiteDecimal } from '../../scales'

describe('YosemiteDecimal', () => {
  describe('Get Score', () => {
    test('5.10a > 5.9', () => {
      const lowGrade = YosemiteDecimal.getScore('5.9')
      const highGrade = YosemiteDecimal.getScore('5.10a')
      expect(highGrade[0]).toBeGreaterThan(lowGrade[1])
    })

    test('5.11a > 5.10+', () => {
      const lowGrade = YosemiteDecimal.getScore('5.10+')
      const highGrade = YosemiteDecimal.getScore('5.11a')
      expect(highGrade[0]).toBeGreaterThan(lowGrade[1])
    })

    test('5.10b > 5.10a', () => {
      const lowGrade = YosemiteDecimal.getScore('5.10a')
      const highGrade = YosemiteDecimal.getScore('5.10b')
      expect(highGrade[0]).toBeGreaterThan(lowGrade[1])
    })

    test('5.12a > 5.11d', () => {
      const lowGrade = YosemiteDecimal.getScore('5.11d')
      const highGrade = YosemiteDecimal.getScore('5.12a')
      expect(highGrade[0]).toBeGreaterThan(lowGrade[1])
    })
    describe('invalid grade format', () => {
      jest.spyOn(console, 'warn').mockImplementation()
      beforeEach(() => {
        jest.clearAllMocks()
      })
      test('extra modifier', () => {
        const invalidGrade = YosemiteDecimal.getScore('5.10a+')
        expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: 5.10a+ for grade scale yds')
        expect(invalidGrade).toEqual(-1)
      })
      test('missing 5. prefix', () => {
        const invalidGrade = YosemiteDecimal.getScore('12a')
        expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: 12a for grade scale yds')
        expect(invalidGrade).toEqual(-1)
      })
      test('not yds scale', () => {
        const invalidGrade = YosemiteDecimal.getScore('v11')
        expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: v11 for grade scale yds')
        expect(invalidGrade).toEqual(-1)
      })
    })
  })

  describe('Is Type', () => {
    test('grade without letter', () => {
      expect(YosemiteDecimal.isType('5.9')).toBeTruthy()
    })

    test('grade with letter', () => {
      expect(YosemiteDecimal.isType('5.11b')).toBeTruthy()
    })

    test('grade with letter uppercased', () => {
      expect(YosemiteDecimal.isType('5.11B')).toBeTruthy()
    })

    test('grade plus modifier is accepted', () => {
      expect(YosemiteDecimal.isType('5.12+')).toBeTruthy()
      expect(YosemiteDecimal.isType('5.12-')).toBeTruthy()
    })

    test('grade with slash', () => {
      expect(YosemiteDecimal.isType('5.10a/b')).toBeTruthy()
    })
    test.failing('grade with slash', () => {
      expect(YosemiteDecimal.isType('5.10d/5.11a')).toBeTruthy()
    })

    test.failing('grade with non-consecutive slash grades', () => {
      expect(YosemiteDecimal.isType('5.10d/c')).toBeFalsy()
      expect(YosemiteDecimal.isType('5.10a/c')).toBeFalsy()
      expect(YosemiteDecimal.isType('5.10c/5.11a')).toBeFalsy()
    })

    test('incorrect type', () => {
      expect(YosemiteDecimal.isType('11+')).toBeFalsy()
      expect(YosemiteDecimal.isType('v1')).toBeFalsy()
      expect(YosemiteDecimal.isType('6a')).toBeFalsy()
    })

    test('has extra characters', () => {
      expect(YosemiteDecimal.isType('5.12a+')).toBeFalsy()
      expect(YosemiteDecimal.isType('5.12ab')).toBeFalsy()
    })
  })

  describe('Get Grade', () => {
    test('bottom of range', () => {
      expect(YosemiteDecimal.getGrade(0)).toBe('5.0')
    })

    test('top of range', () => {
      expect(YosemiteDecimal.getGrade(1000)).toBe('5.16a')
    })

    test('single score provided', () => {
      expect(YosemiteDecimal.getGrade(68)).toBe('5.11a')
      expect(YosemiteDecimal.getGrade(84)).toBe('5.13b')
      expect(YosemiteDecimal.getGrade(65)).toBe('5.10c')
    })

    test('range of scores provided', () => {
      expect(YosemiteDecimal.getGrade([51, 56])).toBe('5.8/5.9')
      expect(YosemiteDecimal.getGrade([63, 65])).toBe('5.10b/c')
      expect(YosemiteDecimal.getGrade([56, 59])).toBe('5.9/5.10a')
      expect(YosemiteDecimal.getGrade([74, 75])).toBe('5.11d/5.12a')
    })
  })

  describe('Get Grade Band', () => {
    test('gets Gradeband', () => {
      expect(YosemiteDecimal.getGradeBand('5.8')).toEqual(GradeBands.BEGINNER)
      expect(YosemiteDecimal.getGradeBand('5.15a')).toEqual(GradeBands.EXPERT)
    })
  })

  describe('Slash scores', () => {
    test('scores of slash grades should be subset of neighboring scores', () => {
      const slashScore = YosemiteDecimal.getScore('5.10a/b')
      const lowScore = YosemiteDecimal.getScore('5.10a')
      const highScore = YosemiteDecimal.getScore('5.10b')

      expect(slashScore[0]).toBeGreaterThan(lowScore[0])
      expect(slashScore[1]).toBeGreaterThan(lowScore[1])
      expect(slashScore[0]).toBeLessThan(highScore[0])
      expect(slashScore[1]).toBeLessThan(highScore[1])
    })
  })
})
