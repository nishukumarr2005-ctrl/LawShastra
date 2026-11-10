import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import App from '../App'
import { LawDetailPage } from '../features/categories/pages/LawDetailPage'

describe('App Smoke Test', () => {
  it('renders the App and Home Page without crashing', () => {
    const { container } = render(<App />)
    expect(container).toBeDefined()
    expect(container.querySelector('#root') || container.firstChild).toBeInTheDocument()
  })

  it('loads a year-suffixed act slug without showing the not found state', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/categories/:lawSlug',
          element: <LawDetailPage />,
        },
      ],
      {
        initialEntries: ['/categories/code-of-civil-procedure-1908'],
      },
    )

    render(<RouterProvider router={router} />)

    expect((await screen.findAllByText('Code of Civil Procedure')).length).toBeGreaterThan(0)
  })
})
