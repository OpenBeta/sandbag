import { Saxon as SaxonScale } from '../../scales'

describe('SAXON', () => {
  describe('valid grade formats', () => {
    let consoleWarnSpy

    beforeEach(() => {
      consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
    })

    afterEach(() => {
      consoleWarnSpy.mockRestore()
    })

    test('should handle valid grade format "1"', () => {
      const score = SaxonScale.getScore('1')
      expect(console.warn).not.toHaveBeenCalled()
      expect(score).not.toEqual(-1)
    })
  })

  describe('isType', () => {
    test('should return true for valid grade format "7a"', () => {
      const isValid = SaxonScale.isType('7a')
      expect(isValid).toBe(true)
    })

    test('should return true for valid grade format "1"', () => {
      const isValid = SaxonScale.isType('1')
      expect(isValid).toBe(true)
    })

    test('should return false for invalid grade format "V"', () => {
      const isValid = SaxonScale.isType('V')
      expect(isValid).toBe(false)
    })

    test('should return false for invalid grade format "8d"', () => {
      const isValid = SaxonScale.isType('8d')
      expect(isValid).toBe(false)
    })
  })

  describe('getScore', () => {
    test('should handle grade format with slash "7a/7b"', () => {
      const score = SaxonScale.getScore('7a/7b')
      expect(score).not.toEqual(-1)
    })
  })
})
