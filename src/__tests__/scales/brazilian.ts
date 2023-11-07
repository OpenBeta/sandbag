import { GradeBands } from '../../GradeBands'
import { BrazilianCrux } from '../../scales'

describe('BrazilianCrux', () => {
  describe('Get Score', () => {
    [
      ['III', 'I'],
      ['IXb', 'VIsup'],
      ['VIsup', 'III'],
      ['VIsup', 'VI']
    ].forEach((t) => {
      test(`${t[0]} > ${t[1]}`, () => {
        const lowGrade = BrazilianCrux.getScore(t[1])
        const highGrade = BrazilianCrux.getScore(t[0])
        expect(highGrade[0]).toBeGreaterThan(lowGrade[1])
      })
    })

    test('Slash grade provided', () => {
      expect(BrazilianCrux.getScore('VI/VIsup')).toStrictEqual([65, 66])
      expect(BrazilianCrux.getScore('VIIIa/b')).toStrictEqual([75, 76])
      expect(BrazilianCrux.getScore('II/IIsup')).toStrictEqual([18, 24])
    })
  })

  describe('Invalid grade format', () => {
    jest.spyOn(console, 'warn').mockImplementation()
    beforeEach(() => {
      jest.clearAllMocks()
    })
    test('invalid plus modifier', () => {
      const invalidGrade = BrazilianCrux.getScore('VI+')
      expect(console.warn).toHaveBeenCalledWith(
        'Unexpected grade format: VI+ for grade scale BrazilianCrux'
      )
      expect(invalidGrade).toEqual(-1)
    })
    test('invalid minus modifier', () => {
      const invalidGrade = BrazilianCrux.getScore('VI-')
      expect(console.warn).toHaveBeenCalledWith(
        'Unexpected grade format: VI- for grade scale BrazilianCrux'
      )
      expect(invalidGrade).toEqual(-1)
    })
    test('extra slash grade', () => {
      const invalidGrade = BrazilianCrux.getScore('VI/VIsup/VII')
      expect(console.warn).toHaveBeenCalledWith(
        'Unexpected grade format: VI/VIsup/VII for grade scale BrazilianCrux'
      )
      expect(invalidGrade).toEqual(-1)
    })
    test('next grade not subsequent (abc)', () => {
      const invalidGrade = BrazilianCrux.getScore('VIIa/c')
      expect(console.warn).toHaveBeenCalledWith(
        'Unexpected grade slash not subsequent: VIIc'
      )
      expect(invalidGrade).toEqual(-1)
    })
    test('next grade not subsequent (sup)', () => {
      const invalidGrade = BrazilianCrux.getScore('V/VIsup')
      expect(console.warn).toHaveBeenCalledWith(
        'Unexpected grade slash not subsequent: VIsup'
      )
      expect(invalidGrade).toEqual(-1)
    })
    test('not BrazilianCrux scale', () => {
      const invalidGrade = BrazilianCrux.getScore('V11')
      expect(console.warn).toHaveBeenCalledWith(
        'Unexpected grade format: V11 for grade scale BrazilianCrux'
      )
      expect(invalidGrade).toEqual(-1)
    })
  })

  describe('Get Grade', () => {
    test('bottom of range', () => {
      expect(BrazilianCrux.getGrade(0)).toBe('I')
    })

    test('top of range', () => {
      expect(BrazilianCrux.getGrade(1000)).toBe('XIVa')
    })

    test('single score provided', () => {
      expect(BrazilianCrux.getGrade(25)).toBe('IIsup')
      expect(BrazilianCrux.getGrade(30)).toBe('III')
      expect(BrazilianCrux.getGrade(48)).toBe('IVsup')
      expect(BrazilianCrux.getGrade(75)).toBe('VIIIa')
    })
    test('range of scores provided', () => {
      expect(BrazilianCrux.getGrade([43, 44])).toBe('IV')
      expect(BrazilianCrux.getGrade([71, 72])).toBe('VIIb/VIIc')
      expect(BrazilianCrux.getGrade([12, 15])).toBe('Isup/II')
      expect(BrazilianCrux.getGrade([44, 55])).toBe('IV/IVsup')
    })
  })

  describe('Get Grade Band', () => {
    test('gets Gradeband', () => {
      expect(BrazilianCrux.getGradeBand('III')).toEqual(GradeBands.BEGINNER)
      expect(BrazilianCrux.getGradeBand('VIIIa')).toEqual(GradeBands.ADVANCED)
      expect(BrazilianCrux.getGradeBand('IXb')).toEqual(GradeBands.EXPERT)
    })
  })
})
