import React from 'react'
import { Construction } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/Card'

export const AdminPagePlaceholder: React.FC<{ title?: string }> = ({ title }) => {
  const { pathname } = useLocation()
  const label = title || pathname.replace('/admin', 'Admin').replace(/\//g, ' / ')
  return (
    <div className="p-6 lg:p-8">
      <Card>
        <CardContent className="py-16 text-center">
          <Construction className="h-10 w-10 text-amber-500 mx-auto mb-3" />
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{label}</h1>
          <p className="mt-2 text-sm text-slate-500">This module is scaffolded and ready for further customization.</p>
        </CardContent>
      </Card>
    </div>
  )
}
