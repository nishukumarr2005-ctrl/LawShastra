import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AdminSidebar } from '../AdminSidebar'
import { AdminHeader } from '../AdminHeader'
import { AdminBreadcrumb } from '../AdminBreadcrumb'
import { AdminLayout } from '../AdminLayout'

describe('AdminSidebar Component', () => {
  it('renders all required module groups and items', () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AdminSidebar isCollapsed={false} onToggle={vi.fn()} />
      </MemoryRouter>
    )

    // Check Branding
    expect(screen.getByText('LAW SHASTRA')).toBeInTheDocument()

    // Check Module Groups
    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByText('Content Management')).toBeInTheDocument()
    expect(screen.getByText('Website Management')).toBeInTheDocument()
    expect(screen.getByText('User Management')).toBeInTheDocument()
    expect(screen.getByText('System')).toBeInTheDocument()

    // Check Key Nav Items
    expect(screen.getByRole('link', { name: /^dashboard$/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /analytics/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /categories & subcategories/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /articles \/ posts/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /legal resources/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /pages management/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /media library/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /tags & keywords/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /homepage builder/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /banners & sliders/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /navigation menus/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /visibility & display controls/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /seo management/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /users & admins/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /roles & permissions/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /feature flags/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /website settings/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /activity logs/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /notifications/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /backup & maintenance/i })).toBeInTheDocument()
  })

  it('triggers onToggle when collapse button is clicked', () => {
    const handleToggle = vi.fn()
    render(
      <MemoryRouter>
        <AdminSidebar isCollapsed={false} onToggle={handleToggle} />
      </MemoryRouter>
    )

    const toggleBtn = screen.getByRole('button', { name: /toggle sidebar/i })
    fireEvent.click(toggleBtn)
    expect(handleToggle).toHaveBeenCalledTimes(1)
  })
})

describe('AdminHeader Component', () => {
  it('renders search input, notifications bell, and user profile', () => {
    render(
      <MemoryRouter>
        <AdminHeader onMenuClick={vi.fn()} />
      </MemoryRouter>
    )

    expect(screen.getByPlaceholderText(/search legal content, settings/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /notifications/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /user profile menu/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /view website/i })).toBeInTheDocument()
  })
})

describe('AdminBreadcrumb Component', () => {
  it('generates breadcrumbs from current route pathname', () => {
    render(
      <MemoryRouter initialEntries={['/admin/categories']}>
        <AdminBreadcrumb />
      </MemoryRouter>
    )

    expect(screen.getByText('Admin')).toBeInTheDocument()
    expect(screen.getByText('Categories')).toBeInTheDocument()
  })
})

describe('AdminLayout Shell Component', () => {
  it('renders sidebar, header, and page children inside the layout workspace', () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AdminLayout>
          <div data-testid="admin-page-content">Custom Content Dashboard</div>
        </AdminLayout>
      </MemoryRouter>
    )

    expect(screen.getByText('LAW SHASTRA')).toBeInTheDocument()
    expect(screen.getByTestId('admin-page-content')).toBeInTheDocument()
    expect(screen.getByText('Custom Content Dashboard')).toBeInTheDocument()
  })
})
