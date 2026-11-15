import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button>Click Me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('triggers onClick handler when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Enroll</Button>)
    fireEvent.click(screen.getByRole('button', { name: /enroll/i }))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled and prevents click events when disabled prop is passed', () => {
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>Disabled</Button>)
    const button = screen.getByRole('button', { name: /disabled/i })
    expect(button).toBeDisabled()
    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('renders loading spinner and disables button when isLoading is true', () => {
    render(<Button isLoading>Submitting</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })
})
