// to run `ts-node ./csvtojson.ts`
// Source sheet: https://docs.google.com/spreadsheets/d/1c0cZDNnj77UqXfJzvSE1MlwtTxmueqdlXG_RpcSzvqU/edit?usp=sharing

import csv from 'csv-parser'
import * as fs from 'fs'
import { Boulder, Route } from '../scales'

const boulderGrades: Boulder[] = []
const routeGrades: Route[] = []

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
      band: data['Level Bands']
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
      band: data['Level Bands']
    })
  })
  .on('end', () => {
    const data = JSON.stringify(routeGrades)
    fs.writeFileSync('routes.json', data)
  // [
  //  { score: 26, yds: '5.10a', french: '3a+', band: 'beginner' },
  //  { score: 27, yds: '5.10a', french: '3b', band: 'beginner' },
  // ]
  })
