import * as grades from '../index'

describe('Grades', function () {
  describe('freeClimbing', function () {
    describe('clean', function () {
      describe('yds', function () {
        it('should have valid grades', function () {
          const expected = [
            '5.0', '5.1', '5.2', '5.3', '5.4',
            '5.5', '5.6', '5.7', '5.8', '5.9',
            '5.10a', '5.10b', '5.10c', '5.10d',
            '5.11a', '5.11b', '5.11c', '5.11d',
            '5.12a', '5.12b', '5.12c', '5.12d',
            '5.13a', '5.13b', '5.13c', '5.13d',
            '5.14a', '5.14b', '5.14c', '5.14d',
            '5.15a', '5.15b', '5.15c', '5.15d'
          ]
          const actual = grades.freeClimbing.clean.yds
          expect(actual).toStrictEqual(expected)
        })
      })
      describe('class', function () {
        it('should have valid grades', function () {
          const expected = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5']
          const actual = grades.freeClimbing.clean.class
          expect(actual).toStrictEqual(expected)
        })
      })
      describe('britishTech', function () {
        it('should have valid grades', function () {
          const expected = ['1', '2', '3', '4a', '4b', '4c',
            '5a', '5b', '5c', '6a', '6b', '6c', '7a', '7b']
          const actual = grades.freeClimbing.clean.britishTech
          expect(actual).toStrictEqual(expected)
        })
      })
      describe('britishAdj', function () {
        it('should have valid grades', function () {
          const expected = ['M', 'D', 'VD', 'S', 'HS', 'HVS',
            'E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'E10',
            'E11']
          const actual = grades.freeClimbing.clean.britishAdj
          expect(actual).toStrictEqual(expected)
        })
      })
      describe('French', function () {
        it('should have valid grades', function () {
          const expected = ['1a', '1b', '1c',
            '2a', '2b', '2c', '3a', '3b', '3c',
            '4a', '4b', '4c', '5a', '5a+', '5b', '5b+', '5c', '5c+',
            '6a', '6a+', '6b', '6b+', '6c', '6c+', '7a', '7a+', '7b',
            '7b+', '7c', '7c+', '8a', '8a+', '8b', '8b+', '8c', '8c+',
            '9a', '9a+', '9b', '9b+', '9c', '9c+']
          const actual = grades.freeClimbing.clean.French
          expect(actual).toStrictEqual(expected)
        })
      })
      describe('UIAA', function () {
        it('should have valid grades', function () {
          const expected = ['1', '2', '3', '4', '4+/5-',
            '5', '5+', '6-', '6', '6+', '7-', '7', '7+',
            '8-', '8', '8+', '9-', '9', '9+', '10-',
            '10', '10+', '11-', '11', '11+', '12-', '12']
          const actual = grades.freeClimbing.clean.UIAA
          expect(actual).toStrictEqual(expected)
        })
      })
    })
  })
  describe('protection', function () {
    it('should have valid protection ratings', function () {
      const expected = ['G', 'PG', 'PG13', 'R', 'X']
      const actual = grades.protection
      expect(actual).toStrictEqual(expected)
    })
  })
})
