import { CloudSun } from 'lucide-react'
import type { UnitSystem } from '../types/weather'

type HeaderProps = {
  units: UnitSystem
  onUnitsChange: (units: UnitSystem) => void
}

export const Header = ({ units, onUnitsChange }: HeaderProps) => (
  <header className='border-b border-slate-200 bg-white px-4 py-3 shadow-sm'>
    <div className='mx-auto flex max-w-screen-2xl items-center justify-between gap-3'>
      <div className='flex items-center gap-3'>
        <CloudSun className='h-7 w-7 text-brand-600' aria-hidden='true' />
        <div>
          <h1 className='text-lg font-semibold text-slate-900'>{import.meta.env.VITE_APP_NAME ?? 'Route Weather Explorer'}</h1>
          <p className='text-sm text-slate-600'>Plan your route. Explore the weather.</p>
        </div>
      </div>
      <label className='flex items-center gap-2 text-sm font-medium text-slate-700'>
        Units
        <select
          value={units}
          onChange={(event) => onUnitsChange(event.target.value as UnitSystem)}
          className='rounded-md border border-slate-300 px-2 py-1 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30'
          aria-label='Select temperature unit'
        >
          <option value='metric'>Celsius</option>
          <option value='imperial'>Fahrenheit</option>
        </select>
      </label>
    </div>
  </header>
)
