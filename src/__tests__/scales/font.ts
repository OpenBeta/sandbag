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

    test('1a/1a+ > 1a', () => {
      const highGrade = Font.getScore('1a/1a+')
      const lowGrade = Font.getScore('1a')
      expect(highGrade[0]).toBeGreaterThan(lowGrade[1])
    })

    test('4a > 3a+/4a', () => {
      const lowGrade = Font.getScore('3a+/4a')
      const highGrade = Font.getScore('4a')
      expect(highGrade[0]).toBeGreaterThan(lowGrade[1])
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
        expect(invalidGrade).toEqual(0)
      })
      test('invalid minus modifier', () => {
        const invalidGrade = Font.getScore('5a-')
        expect(console.warn).toHaveBeenCalledWith(
          expect.stringContaining('Unexpected grade format: 5a-')
        )
        expect(invalidGrade).toEqual(0)
      })
      test('extra slash grade', () => {
        const invalidGrade = Font.getScore('5a/5a+/5b+')
        expect(console.warn).toHaveBeenCalledWith(
          expect.stringContaining('Unexpected grade format: 5a/5a+/5b+')
        )
        expect(invalidGrade).toEqual(0)
      })
      test('extra slash', () => {
        const invalidGrade = Font.getScore('5a/')
        expect(console.warn).toHaveBeenCalledWith(
          expect.stringContaining('Unexpected grade format: 5a/')
        )
        expect(invalidGrade).toEqual(0)
      })
      test('not font scale', () => {
        const invalidGrade = Font.getScore('v11')
        expect(console.warn).toHaveBeenCalledWith(
          expect.stringContaining('Unexpected grade format: v11')
        )
        expect(invalidGrade).toEqual(0)
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

    test('slash grade', () => {
      expect(Font.getGrade(1.5)).toBe('1a/1a+')
      expect(Font.getGrade(3.5)).toBe('1a+/1b')
      expect(Font.getGrade(11.5)).toBe('1c+/2a')
    })
  })
})
