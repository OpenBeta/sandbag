// To run script, in project root directory,
// run `yarn ts-node --esm src/data/csvtojson.ts`

import csv from 'csv-parser'
import * as fs from 'fs'
import { Boulder, Route, IceGrade } from '../scales'
import path from 'path'

const boulderGrades: Boulder[] = []
const routeGrades: Route[] = []

const writeDir = path.join(process.cwd(), 'src/data')
/* Use 'unknown' for default band property as grade band is assigned in each individual grade scale.
 */

fs.createReadStream(path.join(process.cwd(), 'src/data/boulder.csv'))
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
    fs.writeFileSync(`${writeDir}/boulder.json`, data)
  })

fs.createReadStream(path.join(process.cwd(), 'src/data/routes.csv'))
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
    fs.writeFileSync(`${writeDir}/routes.json`, data)
  })

const iceGrades: IceGrade[] = []
fs.createReadStream(path.join(process.cwd(), 'src/data/ice.csv'))
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
    fs.writeFileSync(`${writeDir}/ice.json`, data)
  })
