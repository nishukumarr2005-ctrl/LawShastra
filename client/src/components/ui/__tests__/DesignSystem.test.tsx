import { render, screen, fireEvent } from '@testing-library/react'
import { Select } from '../Select'
import { Switch } from '../Switch'
import { Dialog } from '../Dialog'
import { ConfirmationDialog } from '../ConfirmationDialog'
import { Tabs, TabList, TabTrigger, TabContent } from '../Tabs'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../Card'
import { Skeleton } from '../Skeleton'
import { EmptyState } from '../EmptyState'
import { ErrorState } from '../ErrorState'
import { ToastProvider, useToast } from '../Toast'

describe('Select Component', () => {
  const options = [
    { value: 'civil', label: 'Civil Law' },
    { value: 'criminal', label: 'Criminal Law' },
  ]

  it('renders select with options and placeholder', () => {
    render(<Select options={options} placeholder="Choose category" aria-label="Category" />)
    expect(screen.getByRole('combobox', { name: /category/i })).toBeInTheDocument()
    expect(screen.getByText('Choose category')).toBeInTheDocument()
    expect(screen.getByText('Civil Law')).toBeInTheDocument()
    expect(screen.getByText('Criminal Law')).toBeInTheDocument()
  })

  it('handles value change', () => {
    let selected = ''
    render(
      <Select
        options={options}
        aria-label="Category"
        onChange={(e) => {
          selected = e.target.value
        }}
      />
    )
    fireEvent.change(screen.getByRole('combobox', { name: /category/i }), {
      target: { value: 'criminal' },
    })
    expect(selected).toBe('criminal')
  })

  it('displays error message when provided', () => {
    render(<Select options={options} error="Selection is required" aria-label="Category" />)
    expect(screen.getByText('Selection is required')).toBeInTheDocument()
  })
})

describe('Switch Component', () => {
  it('renders unchecked by default and handles toggling', () => {
    let checked = false
    render(
      <Switch
        label="Enable Feature"
        checked={checked}
        onCheckedChange={(val) => {
          checked = val
        }}
      />
    )
    const toggle = screen.getByRole('switch', { name: /enable feature/i })
    expect(toggle).toHaveAttribute('aria-checked', 'false')
    fireEvent.click(toggle)
    expect(checked).toBe(true)
  })

  it('disables the switch when disabled prop is passed', () => {
    render(<Switch label="Locked Feature" disabled checked={false} onCheckedChange={() => {}} />)
    const toggle = screen.getByRole('switch', { name: /locked feature/i })
    expect(toggle).toBeDisabled()
  })
})

describe('Dialog and ConfirmationDialog Components', () => {
  it('renders dialog when isOpen is true and hides when false', () => {
    const handleClose = vi.fn()
    const { rerender } = render(
      <Dialog isOpen={true} onClose={handleClose} title="Edit Category">
        <div>Category Edit Form</div>
      </Dialog>
    )
    expect(screen.getByText('Edit Category')).toBeInTheDocument()
    expect(screen.getByText('Category Edit Form')).toBeInTheDocument()

    const closeBtn = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeBtn)
    expect(handleClose).toHaveBeenCalled()

    rerender(
      <Dialog isOpen={false} onClose={handleClose} title="Edit Category">
        <div>Category Edit Form</div>
      </Dialog>
    )
    expect(screen.queryByText('Edit Category')).not.toBeInTheDocument()
  })

  it('renders ConfirmationDialog with title, confirm action, and cancel action', () => {
    const handleConfirm = vi.fn()
    const handleCancel = vi.fn()

    render(
      <ConfirmationDialog
        isOpen={true}
        title="Delete Statute?"
        description="This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    )

    expect(screen.getByText('Delete Statute?')).toBeInTheDocument()
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /yes, delete/i }))
    expect(handleConfirm).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(handleCancel).toHaveBeenCalledTimes(1)
  })
})

describe('Tabs Component', () => {
  it('renders tabs and switches active content on click', () => {
    render(
      <Tabs defaultValue="overview">
        <TabList>
          <TabTrigger value="overview">Overview</TabTrigger>
          <TabTrigger value="settings">Settings</TabTrigger>
        </TabList>
        <TabContent value="overview">Overview Content Panel</TabContent>
        <TabContent value="settings">Settings Content Panel</TabContent>
      </Tabs>
    )

    expect(screen.getByText('Overview Content Panel')).toBeInTheDocument()
    expect(screen.queryByText('Settings Content Panel')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('tab', { name: /settings/i }))
    expect(screen.getByText('Settings Content Panel')).toBeInTheDocument()
    expect(screen.queryByText('Overview Content Panel')).not.toBeInTheDocument()
  })
})

describe('Card, Skeleton, EmptyState & ErrorState Components', () => {
  it('renders structured Card component', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Total Laws</CardTitle>
          <CardDescription>All codified bare acts</CardDescription>
        </CardHeader>
        <CardContent>
          <p>186 Statutes</p>
        </CardContent>
        <CardFooter>
          <button>View Details</button>
        </CardFooter>
      </Card>
    )

    expect(screen.getByText('Total Laws')).toBeInTheDocument()
    expect(screen.getByText('All codified bare acts')).toBeInTheDocument()
    expect(screen.getByText('186 Statutes')).toBeInTheDocument()
    expect(screen.getByText('View Details')).toBeInTheDocument()
  })

  it('renders Skeleton with proper aria attributes', () => {
    render(<Skeleton className="h-6 w-24" aria-label="Loading metric" />)
    const skeleton = screen.getByLabelText('Loading metric')
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveClass('animate-pulse')
  })

  it('renders EmptyState with action button', () => {
    const handleAction = vi.fn()
    render(
      <EmptyState
        title="No articles found"
        description="Try adjusting your filters or search terms."
        actionLabel="Create Article"
        onAction={handleAction}
      />
    )

    expect(screen.getByText('No articles found')).toBeInTheDocument()
    expect(screen.getByText('Try adjusting your filters or search terms.')).toBeInTheDocument()
    const actionBtn = screen.getByRole('button', { name: /create article/i })
    fireEvent.click(actionBtn)
    expect(handleAction).toHaveBeenCalledTimes(1)
  })

  it('renders ErrorState with retry callback', () => {
    const handleRetry = vi.fn()
    render(
      <ErrorState
        title="Failed to load categories"
        message="Network error encountered."
        onRetry={handleRetry}
      />
    )

    expect(screen.getByText('Failed to load categories')).toBeInTheDocument()
    expect(screen.getByText('Network error encountered.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /retry/i }))
    expect(handleRetry).toHaveBeenCalledTimes(1)
  })
})

describe('Toast Notification System', () => {
  function ToastConsumer() {
    const { addToast } = useToast()
    return (
      <div>
        <button
          onClick={() =>
            addToast({
              title: 'Saved Successfully',
              description: 'Article draft updated.',
              type: 'success',
            })
          }
        >
          Trigger Toast
        </button>
      </div>
    )
  }

  it('displays toast on notification trigger', () => {
    render(
      <ToastProvider>
        <ToastConsumer />
      </ToastProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: /trigger toast/i }))
    expect(screen.getByText('Saved Successfully')).toBeInTheDocument()
    expect(screen.getByText('Article draft updated.')).toBeInTheDocument()
  })
})
