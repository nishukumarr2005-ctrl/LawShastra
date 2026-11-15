import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AdminOverviewPage } from '../pages/AdminOverviewPage'
import { AuthProvider } from '@/features/admin/auth/AuthContext'

describe('AdminOverviewPage Component', () => {
  it('renders overview metrics cards and quick actions', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <AdminOverviewPage />
        </AuthProvider>
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: /^dashboard$/i })).toBeInTheDocument()
    expect(screen.getByText('Total Categories')).toBeInTheDocument()
    expect(screen.getByText('Total Bare Acts')).toBeInTheDocument()
    expect(screen.getByText('Published Statutes')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /categories & subcategories/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /view website/i })).toBeInTheDocument()
  })
})
