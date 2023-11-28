import { GradeScales, GradeScalesTypes } from './GradeScale'
import {
  getScale,
  getScore,
  getScoreForSort,
  isVScale,
  convertGrade
} from './GradeParser'
import { GradeBands, GradeBandTypes } from './GradeBands'
import { AI, Aid, Ewbank, Font, French, Norwegian, Saxon, UIAA, VScale, WI, YosemiteDecimal, BrazilianCrux } from './scales'

import { GradeContexts, gradeContextToGradeScales, getCountriesDefaultGradeContext } from './GradeContexts'

// Free Climbing Grades
// YDS
// French
// British - Tech
// British - Adj
// UIAA
// Saxon
// Ewbank (AUS, NZL)
// Ewbank South Africa
// Nordic - Finnish
// Brazilian
// Kurtyka (Poland)

const YDS_ARRAY = [
  '5.0',
  '5.1',
  '5.2',
  '5.3',
  '5.4',
  '5.5',
  '5.6',
  '5.7',
  '5.8',
  '5.9',
  '5.10a',
  '5.10b',
  '5.10c',
  '5.10d',
  '5.11a',
  '5.11b',
  '5.11c',
  '5.11d',
  '5.12a',
  '5.12b',
  '5.12c',
  '5.12d',
  '5.13a',
  '5.13b',
  '5.13c',
  '5.13d',
  '5.14a',
  '5.14b',
  '5.14c',
  '5.14d',
  '5.15a',
  '5.15b',
  '5.15c',
  '5.15d'
]

const SAXON_ARRAY = [
  '1', '2', '3', '4', '5', '6', '7a',
  '7b', '7c', '8a', '8b', '8c', '9a',
  '9b', '9c', '10a', '10b', '10c', '11a',
  '11b', '11c', '12a', '12b'
]

const BRITISH_TECH_ARRAY = [
  '1',
  '2',
  '3',
  '4a',
  '4b',
  '4c',
  '5a',
  '5b',
  '5c',
  '6a',
  '6b',
  '6c',
  '7a',
  '7b'
]

const BRITISH_ADJ_ARRAY = [
  'M',
  'D',
  'VD',
  'S',
  'HS',
  'HVS',
  'E1',
  'E2',
  'E3',
  'E4',
  'E5',
  'E6',
  'E7',
  'E8',
  'E9',
  'E10',
  'E11'
]

const FRENCH_ARRAY = [
  '1a',
  '1b',
  '1c',
  '2a',
  '2b',
  '2c',
  '3a',
  '3b',
  '3c',
  '4a',
  '4b',
  '4c',
  '5a',
  '5a+',
  '5b',
  '5b+',
  '5c',
  '5c+',
  '6a',
  '6a+',
  '6b',
  '6b+',
  '6c',
  '6c+',
  '7a',
  '7a+',
  '7b',
  '7b+',
  '7c',
  '7c+',
  '8a',
  '8a+',
  '8b',
  '8b+',
  '8c',
  '8c+',
  '9a',
  '9a+',
  '9b',
  '9b+',
  '9c',
  '9c+'
]

const UIAA_ARRAY = [
  '1',
  '2',
  '3',
  '4',
  '4+/5-',
  '5',
  '5+',
  '6-',
  '6',
  '6+',
  '7-',
  '7',
  '7+',
  '8-',
  '8',
  '8+',
  '9-',
  '9',
  '9+',
  '10-',
  '10',
  '10+',
  '11-',
  '11',
  '11+',
  '12-',
  '12'
]

const EWBANK_ARRAY = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
  '29',
  '30',
  '31',
  '32',
  '33',
  '34',
  '35',
  '36',
  '37',
  '38',
  '39',
  '40'
]

const NORWAY_ARRAY = [
  '1-',
  '1',
  '1+',
  '2-',
  '2',
  '2+',
  '3-',
  '3',
  '3+',
  '4-',
  '4',
  '4+',
  '5-',
  '5',
  '5+',
  '6-',
  '6',
  '6+',
  '7-',
  '7',
  '7+',
  '8-',
  '8',
  '8+',
  '9-',
  '9',
  '9+',
  '10-',
  '10',
  '10+',
  '11-',
  '11',
  '11+',
  '12-',
  '12',
  '12+'
]

const CLASS_ARRAY = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5']

export const protection = ['G', 'PG', 'PG13', 'R', 'X']

// Bouldering
// Hueco
// Fontainebleau

export const freeClimbing = {
  clean: {
    yds: YDS_ARRAY,
    class: CLASS_ARRAY,
    britishTech: BRITISH_TECH_ARRAY,
    britishAdj: BRITISH_ADJ_ARRAY,
    French: FRENCH_ARRAY,
    UIAA: UIAA_ARRAY,
    Ewbank: EWBANK_ARRAY,
    Saxon: SAXON_ARRAY,
    Norwegian: NORWAY_ARRAY,
    BrazilianCrux: BrazilianCrux.grades
  },
  community: {}
}

export const bouldering = {}

export { convertGrade }

export {
  getScore,
  getScoreForSort,
  isVScale,
  getScale,
  GradeScales,
  GradeScalesTypes,
  GradeBands,
  GradeBandTypes
}

export {
  AI,
  Aid,
  Ewbank,
  Font,
  French,
  Norwegian,
  Saxon,
  UIAA,
  VScale,
  WI,
  YosemiteDecimal,
  BrazilianCrux
}

export { GradeContexts, gradeContextToGradeScales, getCountriesDefaultGradeContext }
