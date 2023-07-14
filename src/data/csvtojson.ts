// To run script, in project root directory,
// run `yarn ts-node --esm src/data/csvtojson.ts`

import csv from 'csv-parser'
import * as fs from 'fs'
import { AidGrade, Boulder, Route, IceGrade } from '../scales'
import path from 'path'

const dataDir = path.join(process.cwd(), 'src', 'data')

async function getData<T> (pathCsv: any, pathJson): Promise<T[]> {
  const data: T[] = []
  return await new Promise((resolve, reject) => {
    fs.createReadStream(pathCsv)
      .on('error', error => {
        console.warn('error in parsing:', error)
        reject(error)
      })
      .pipe(csv({
        mapValues: ({ header, index, value }) => { return header === 'score' ? parseInt(value, 10) : value }
      }))
      .on('data', (row) => {
        data.push(row)
      })
      .on('end', () => {
        const parsedData = JSON.stringify(data)
        fs.writeFileSync(pathJson, parsedData)

        resolve(data)
      })
  })
}

const CSV_PATH_BOULDER = path.join(dataDir, 'boulder.csv')
const JSON_PATH_BOULDER = path.join(dataDir, 'boulder.json')
export const BOULDER_GRADE_TABLE: Promise<Boulder[]> = getData(CSV_PATH_BOULDER, JSON_PATH_BOULDER)

const CSV_PATH_ROUTES = path.join(dataDir, 'routes.csv')
const JSON_PATH_ROUTES = path.join(dataDir, 'routes.json')
export const ROUTE_GRADE_TABLE: Promise<Route[]> = getData(CSV_PATH_ROUTES, JSON_PATH_ROUTES)

const CSV_PATH_ICE = path.join(dataDir, 'ice.csv')
const JSON_PATH_ICE = path.join(dataDir, 'ice.json')
export const ICE_GRADE_TABLE: Promise<IceGrade[]> = getData(CSV_PATH_ICE, JSON_PATH_ICE)

const CSV_PATH_AID = path.join(dataDir, 'aid.csv')
const JSON_PATH_AID = path.join(dataDir, 'aid.json')
export const AID_GRADE_TABLE: Promise<AidGrade[]> = getData(CSV_PATH_AID, JSON_PATH_AID)
