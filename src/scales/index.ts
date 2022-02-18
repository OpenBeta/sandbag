import VScale from './v'
import YosemiteDecimal from './yds'
import Font from './font'
import French from './french'
export { VScale, Font, YosemiteDecimal, French }

export interface Boulder {
  score: number
  v: string
  font: string
  band: 'beginner' | 'intermediate' | 'elite' | 'advanced'
}

export interface Route {
  score: number
  yds: string
  french: string
  band: 'beginner' | 'intermediate' | 'elite' | 'experienced'
}
