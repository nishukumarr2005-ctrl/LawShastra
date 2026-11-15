import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '../AuthContext'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

function TestAuthConsumer() {
  const { user, isAuthenticated, login, logout, hasPermission } = useAuth()

  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'Logged In' : 'Logged Out'}</div>
      <div data-testid="user-email">{user?.email || 'No Email'}</div>
      <div data-testid="can-delete-category">
        {hasPermission('categories.delete') ? 'Can Delete' : 'Cannot Delete'}
      </div>
      <button
        onClick={() =>
          login({
            id: 1,
            name: 'Adv. Test Admin',
            email: 'admin@lawshastra.in',
            role: 'SUPER_ADMIN',
            permissions: ['*'],
          })
        }
      >
        Mock Login
      </button>
      <button onClick={logout}>Mock Logout</button>
    </div>
  )
}

describe('AuthContext and ProtectedRoute', () => {
  it('initializes in logged-out state and updates upon login and logout', () => {
    render(
      <AuthProvider>
        <TestAuthConsumer />
      </AuthProvider>
    )

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged Out')
    expect(screen.getByTestId('user-email')).toHaveTextContent('No Email')

    fireEvent.click(screen.getByRole('button', { name: /mock login/i }))
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged In')
    expect(screen.getByTestId('user-email')).toHaveTextContent('admin@lawshastra.in')
    expect(screen.getByTestId('can-delete-category')).toHaveTextContent('Can Delete')

    fireEvent.click(screen.getByRole('button', { name: /mock logout/i }))
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged Out')
  })

  it('redirects to /admin/login when accessing ProtectedRoute while unauthenticated', () => {
    render(
      <MemoryRouter initialEntries={['/admin/secret']}>
        <AuthProvider>
          <Routes>
            <Route path="/admin/login" element={<div>Login Page Form</div>} />
            <Route
              path="/admin/secret"
              element={
                <ProtectedRoute>
                  <div>Secret Dashboard Content</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    )

    expect(screen.getByText('Login Page Form')).toBeInTheDocument()
    expect(screen.queryByText('Secret Dashboard Content')).not.toBeInTheDocument()
  })
})
