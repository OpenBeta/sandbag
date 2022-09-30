import { GradeBands } from '../../GradeBands'
import { French } from '../../scales'

describe('French', () => {
  describe('Get Score', () => {
    test('9a > 5c', () => {
      const lowGrade = French.getScore('5c')
      const highGrade = French.getScore('9a')
      expect(highGrade[0]).toBeGreaterThan(lowGrade[1])
    })

    test('1c > 1a+', () => {
      const highGrade = French.getScore('1c')
      const lowGrade = French.getScore('1a+')
      expect(highGrade[0]).toBeGreaterThan(lowGrade[1])
    })

    test('1a/1a+ > 1a, one grade away', () => {
      const highGrade = French.getScore('1a/1a+')
      const lowGrade = French.getScore('1a')
      expect(highGrade[0] < lowGrade[1] && highGrade[0] > lowGrade[0])
      expect(highGrade[1]).toBeGreaterThan(lowGrade[1])
    })

    test('4a > 3c+/4a, one grade away', () => {
      const highGrade = French.getScore('4a')
      const lowGrade = French.getScore('3c+/4a')
      expect(highGrade[0] < lowGrade[1] && highGrade[0] > lowGrade[0])
      expect(highGrade[1]).toBeGreaterThan(lowGrade[1])
    })
  })

  describe('invalid grade format', () => {
    jest.spyOn(console, 'warn').mockImplementation()
    beforeEach(() => {
      jest.clearAllMocks()
    })
    test('extra plus modifier', () => {
      const invalidGrade = French.getScore('5a++')
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Unexpected grade format: 5a++')
      )
      expect(invalidGrade).toEqual(-1)
    })
    test('invalid minus modifier', () => {
      const invalidGrade = French.getScore('5a-')
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Unexpected grade format: 5a-')
      )
      expect(invalidGrade).toEqual(-1)
    })
    test('extra slash grade', () => {
      const invalidGrade = French.getScore('5a/5a+/5b+')
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Unexpected grade format: 5a/5a+/5b+')
      )
      expect(invalidGrade).toEqual(-1)
    })
    test('extra slash', () => {
      const invalidGrade = French.getScore('5a/')
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Unexpected grade format: 5a/')
      )
      expect(invalidGrade).toEqual(-1)
    })
    test('not French scale', () => {
      const invalidGrade = French.getScore('v11')
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Unexpected grade format: v11')
      )
      expect(invalidGrade).toEqual(-1)
    })
  })

  describe('Get Grade', () => {
    test('bottom of range', () => {
      expect(French.getGrade(0)).toBe('1a')
    })

    test('top of range', () => {
      expect(French.getGrade(1000)).toBe('9c+')
    })

    test('single score provided', () => {
      expect(French.getGrade(34)).toBe('3c+')
      expect(French.getGrade(34.5)).toBe('3c+')
      expect(French.getGrade(35)).toBe('3c+')
    })
    test('range of scores provided', () => {
      expect(French.getGrade([0.5, 2])).toBe('1a/1a+')
      expect(French.getGrade([8, 12])).toBe('1c/2a')
      expect(French.getGrade([16, 17])).toBe('2b')
    })
  })

  describe('Get Grade Band', () => {
    test('gets Gradeband', () => {
      expect(French.getGradeBand('1a')).toEqual(GradeBands.BEGINNER)
      expect(French.getGradeBand('9c+')).toEqual(GradeBands.EXPERT)
    })
  })
})
