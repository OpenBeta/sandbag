import { GradeBands } from '../../GradeParser'
import { Font } from '../../scales'

describe('Font', () => {
  describe('Get Score', () => {
    test('9a > 5c', () => {
      const lowGrade = Font.getScore('5c')
      const highGrade = Font.getScore('9a')
      expect(highGrade[0]).toBeGreaterThan(lowGrade[1])
    })

    test('1c > 1a+', () => {
      const highGrade = Font.getScore('1c')
      const lowGrade = Font.getScore('1a+')
      expect(highGrade[0]).toBeGreaterThan(lowGrade[1])
    })

    test('1a/1a+ > 1a, one grade away', () => {
      const highGrade = Font.getScore('1a/1a+')
      const lowGrade = Font.getScore('1a')
      expect(highGrade[0] < lowGrade[1] && highGrade[0] > lowGrade[0])
      expect(highGrade[1]).toBeGreaterThan(lowGrade[1])
    })

    test('4a > 3c+/4a, one grade away', () => {
      const highGrade = Font.getScore('4a')
      const lowGrade = Font.getScore('3c+/4a')
      expect(highGrade[0] < lowGrade[1] && highGrade[0] > lowGrade[0])
      expect(highGrade[1]).toBeGreaterThan(lowGrade[1])
    })

    describe('invalid grade format', () => {
      jest.spyOn(console, 'warn').mockImplementation()
      beforeEach(() => {
        jest.clearAllMocks()
      })
      test('extra plus modifier', () => {
        const invalidGrade = Font.getScore('5a++')
        expect(console.warn).toHaveBeenCalledWith(
          expect.stringContaining('Unexpected grade format: 5a++')
        )
        expect(invalidGrade).toEqual(-1)
      })
      test('invalid minus modifier', () => {
        const invalidGrade = Font.getScore('5a-')
        expect(console.warn).toHaveBeenCalledWith(
          expect.stringContaining('Unexpected grade format: 5a-')
        )
        expect(invalidGrade).toEqual(-1)
      })
      test('extra slash grade', () => {
        const invalidGrade = Font.getScore('5a/5a+/5b+')
        expect(console.warn).toHaveBeenCalledWith(
          expect.stringContaining('Unexpected grade format: 5a/5a+/5b+')
        )
        expect(invalidGrade).toEqual(-1)
      })
      test('extra slash', () => {
        const invalidGrade = Font.getScore('5a/')
        expect(console.warn).toHaveBeenCalledWith(
          expect.stringContaining('Unexpected grade format: 5a/')
        )
        expect(invalidGrade).toEqual(-1)
      })
      test('not font scale', () => {
        const invalidGrade = Font.getScore('v11')
        expect(console.warn).toHaveBeenCalledWith(
          expect.stringContaining('Unexpected grade format: v11')
        )
        expect(invalidGrade).toEqual(-1)
      })
    })
  })

  describe('Get Grade', () => {
    test('bottom of range', () => {
      expect(Font.getGrade(0)).toBe('1a')
    })

    test('top of range', () => {
      expect(Font.getGrade(1000)).toBe('9c+')
    })

    test('single score provided', () => {
      expect(Font.getGrade(34)).toBe('3c+')
      expect(Font.getGrade(34.5)).toBe('3c+')
      expect(Font.getGrade(35)).toBe('3c+')
    })
    test('range of scores provided', () => {
      expect(Font.getGrade([0.5, 2])).toBe('1a/1a+')
      expect(Font.getGrade([8, 12])).toBe('1c/2a')
      expect(Font.getGrade([16, 17])).toBe('2b')
    })
  })

  describe('Get Grade Band', () => {
    test('gets Gradeband', () => {
      expect(Font.getGradeBand(0)).toEqual(GradeBands.BEGINNER)
      expect(Font.getGradeBand(72)).toEqual(GradeBands.EXPERT)
    })
  })
})
