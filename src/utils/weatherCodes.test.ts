import { describe, expect, it } from 'vitest'
import { interpretWeatherCode } from './weatherCodes'

describe('weather code interpretation', () => {
  it('maps known and unknown codes', () => {
    expect(interpretWeatherCode(0).label).toContain('Clear')
    expect(interpretWeatherCode(999).label).toContain('Unknown')
  })
})
