import { VScale } from '../../scales'

describe('V', () => {
  describe('Get Score', () => {
    test('v5 > V3', () => {
      const rangeV5 = VScale.getScore('v5')
      const rangeV3 = VScale.getScore('V3')
      expect(rangeV5[0]).toBeGreaterThan(rangeV3[1])
    })

    test('v2-3 overlaps with V2', () => {
      const rangeV23 = VScale.getScore('v2-3')
      const rangeV2 = VScale.getScore('V2')
      expect(rangeV23[0]).toBeGreaterThan(rangeV2[0])
      expect(rangeV2[1]).toBeLessThan(rangeV23[1])
    })

    test('v15 < V15+', () => {
      const rangeV15 = VScale.getScore('v15')
      const rangeV15plus = VScale.getScore('v15+')
      expect(rangeV15plus[0]).toBeGreaterThan(rangeV15[0])
      expect(rangeV15[1]).toBeLessThan(rangeV15plus[1])
    })
  })

  describe('Is Type', () => {
    test('grade with lower case v', () => {
      expect(VScale.isType('v5')).toBeTruthy()
    })

    test('grade with upper case V', () => {
      expect(VScale.isType('V5')).toBeTruthy()
    })

    test('two digit grade', () => {
      expect(VScale.isType('V14')).toBeTruthy()
    })

    test('grade with dash', () => {
      expect(VScale.isType('v2-3')).toBeTruthy()
    })

    test('grade plus modifier is accepted', () => {
      expect(VScale.isType('v20+')).toBeTruthy()
    })

    test('missing v', () => {
      expect(VScale.isType('12-3')).toBeFalsy()
    })

    test('has extra characters', () => {
      expect(VScale.isType('v20a+')).toBeFalsy()
    })
  })

  describe('Get Grade', () => {
    test('bottom of range', () => {
      expect(VScale.getGrade(0)).toBe('VB-')
    })

    test('top of range', () => {
      expect(VScale.getGrade(1000)).toBe('V22')
    })

    test('single score provided', () => {
      expect(VScale.getGrade(62)).toBe('V3')
      expect(VScale.getGrade(61)).toBe('V3')
      expect(VScale.getGrade(63)).toBe('V4')
    })

    test('range of scores provided', () => {
      expect(VScale.getGrade([51, 56])).toBe('V1-V2')
      expect(VScale.getGrade([77, 80])).toBe('V8-V9')
      expect(VScale.getGrade([66, 72])).toBe('V4-V6')
    })
  })
})
