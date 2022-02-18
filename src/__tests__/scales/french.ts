import { French } from '../../scales'

describe('French', () => {
  describe('Get Score', () => {
    test('1c > 1a+', () => {
      const lowGrade = French.getScore('1c')
      const highGrade = French.getScore('1a+')
      expect(lowGrade[0]).toBeGreaterThan(highGrade[1])
    })
  })

  describe('Get Grade', () => {
    test('bottom of range', () => {
      expect(Font.getGrade(0)).toBe('1a')
    })

    test('top of range', () => {
      expect(Font.getGrade(1000)).toBe('9c+')
    })
  })
})
