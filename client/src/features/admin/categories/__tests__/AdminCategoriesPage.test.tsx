import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AdminCategoriesPage } from '../pages/AdminCategoriesPage'
import { AuthProvider } from '@/features/admin/auth/AuthContext'

describe('AdminCategoriesPage Component', () => {
  it('renders category management table with action buttons', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <AdminCategoriesPage />
        </AuthProvider>
      </MemoryRouter>
    )

    expect(screen.getByText(/category management/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add category/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/search categories/i)).toBeInTheDocument()
  })

  it('opens create category modal when clicking Add Category button', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <AdminCategoriesPage />
        </AuthProvider>
      </MemoryRouter>
    )

    const addBtn = screen.getByRole('button', { name: /add category/i })
    fireEvent.click(addBtn)

    expect(screen.getByText('Create New Category')).toBeInTheDocument()
    expect(screen.getByLabelText(/category name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/custom slug/i)).toBeInTheDocument()
  })
})
