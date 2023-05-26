// to run `ts-node ./csvtojson.ts`

import csv from 'csv-parser'
import * as fs from 'fs'
import { Boulder, Route, IceGrade } from '../scales'

const boulderGrades: Boulder[] = []
const routeGrades: Route[] = []

/* Use 'unknown' for default band property as grade band is assigned in each individual grade scale.
 */

fs.createReadStream('./boulder.csv')
  .pipe(csv())
  .on('data', (data) => {
    if (data['V Scale'] === '' && data['Font Scale'] === '') {
      return
    }
    boulderGrades.push({
      score: parseInt(data.Score, 10),
      v: data['V Scale'],
      font: data['Font Scale'],
      band: 'unknown'
    })
  })
  .on('end', () => {
    const data = JSON.stringify(boulderGrades)
    fs.writeFileSync('boulder.json', data)
    // [
    //  { score: 26, v: 'VB+', font: '3a+', band: 'beginner' },
    //  { score: 27, v: 'VB+', font: '3a+', band: 'beginner' },
    // ]
  })

fs.createReadStream('./routes.csv')
  .pipe(csv())
  .on('data', (data) => {
    if (data.Yosemite === '' && data.Yosemite === '') {
      return
    }
    routeGrades.push({
      score: parseInt(data.Score, 10),
      yds: data.Yosemite,
      french: data.French,
      uiaa: data.UIAA,
      ewbank: data.Ewbank,
      saxon: data.Saxon,
      band: 'unknown'
    })
  })
  .on('end', () => {
    const data = JSON.stringify(routeGrades)
    fs.writeFileSync('routes.json', data)
    // [
    //  { score: 26, yds: '5.10a', french: '3a+',saxon: '3', band: 'beginner' },
    //  { score: 27, yds: '5.10a', french: '3b',saxon: '3', band: 'beginner' },
    // ]
  })

const iceGrades: IceGrade[] = []
fs.createReadStream('./ice.csv')
  .pipe(csv())
  .on('data', (data) => {
    if (data.AI === '' && data.WI === '') {
      return
    }
    iceGrades.push({
      score: parseInt(data.Score, 10),
      wi: data.WI,
      ai: data.AI
    })
  })
  .on('end', () => {
    const data = JSON.stringify(iceGrades)
    fs.writeFileSync('ice.json', data)
  })
