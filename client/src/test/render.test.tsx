import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import App from '../App'

describe('App Smoke Test', () => {
  it('renders the App and Home Page without crashing', () => {
    const { container } = render(<App />)
    expect(container).toBeDefined()
    expect(container.querySelector('#root') || container.firstChild).toBeInTheDocument()
  })
})
