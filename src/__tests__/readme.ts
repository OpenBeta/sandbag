import {
  French,
  YosemiteDecimal,
  Font,
  VScale,
  GradeScales,
  convertGrade,
  Ewbank
} from '../index'

describe('Convert grades to scores', () => {
  test('returns the correct score', () => {
    expect(French.getScore('8a')).toEqual([84, 85])
    expect(French.getScore('7c+/8a')).toEqual([82.5, 84.5])
    expect(YosemiteDecimal.getScore('5.12+')).toEqual([78.5, 80.5])
  })
})

describe('Convert scores to greades', () => {
  test('supports single score', () => {
    expect(Font.getGrade(80)).toEqual('7c')
  })
  test('supports a range of scores', () => {
    expect(Font.getGrade([79, 81])).toEqual('7b+/7c')
  })
})

describe('Validate grading scales', () => {
  test('6A is Font scale not VScale', () => {
    expect(VScale.isType('6A')).toBe(false)
    expect(Font.isType('6A')).toBe(true)
  })
})

describe('Convert grades across scales', () => {
  jest.spyOn(console, 'warn').mockImplementation()
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('5.11a YDS is 6b+/6c in Frence', () => {
    expect(convertGrade('5.11a', GradeScales.YDS, GradeScales.FRENCH)).toEqual(
      '6b+/6c'
    )
  })
  test('6a Font is V3', () => {
    expect(convertGrade('6a', GradeScales.FONT, GradeScales.VSCALE)).toEqual(
      'V3'
    )
  })
  test('Convert from yds to vscale is not allowed', () => {
    expect(convertGrade('5.11a', GradeScales.YDS, GradeScales.VSCALE)).toEqual(
      ''
    )
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining(
        "Scale: Yosemite Decimal System doesn't support converting to Scale: V Scale"
      )
    )
  })
})

describe('Get gradeband', () => {
  test('returns correct grade band', () => {
    expect(Ewbank.getGradeBand('10')).toEqual('beginner')
    expect(Ewbank.getGradeBand('30')).toEqual('expert')
  })
  test('pass invalid grade format returns unknown', () => {
    expect(Ewbank.getGradeBand('6a')).toEqual('unknown')
  })
})

describe('Compare grades', () => {
  const harder = French.getScore('8a') // Output: [ 84, 85 ]
  const easier = YosemiteDecimal.getScore('5.13a') // Output: [ 82, 83 ]
  test('returns correct score', () => {
    expect(harder).toEqual([84, 85])
    expect(easier).toEqual([82, 83])
    expect(harder > easier).toBe(true)
  })
})
