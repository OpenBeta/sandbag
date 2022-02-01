import { YosemiteDecimal } from '../../scales'

describe('YosemiteDecimal', () => {
  describe('Get Score', () => {
    test('5.10a > 5.9', () => {
      const lowGrade = YosemiteDecimal.getScore('5.10a')
      const highGrade = YosemiteDecimal.getScore('5.9')
      expect(lowGrade[0]).toBeGreaterThan(highGrade[1])
    })
  })

  describe('Get Grade', () => {
    test('bottom of range', () => {
      expect(YosemiteDecimal.getGrade(0)).toBe('5.0')
    })

    test('top of range', () => {
      expect(YosemiteDecimal.getGrade(1000)).toBe('5.16a')
    })
  })
})
