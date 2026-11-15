import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { HomePage } from '@/features/home/pages/HomePage'
import { CoursesPage } from '@/features/courses/pages/CoursesPage'
import { CourseDetailsPage } from '@/features/courses/pages/CourseDetailsPage'
import { CategoriesPage } from '@/features/categories/pages/CategoriesPage'
import { LawDetailPage } from '@/features/categories/pages/LawDetailPage'
import { NotFoundPage } from '@/components/common/NotFoundPage'
import { AdminLoginPage } from '@/features/admin/pages/AdminLoginPage'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import { AdminLayout } from '@/components/layout/admin/AdminLayout'
import { AdminOverviewPage } from '@/features/admin/dashboard/pages/AdminOverviewPage'
import { AnalyticsPage } from '@/features/admin/analytics/pages/AnalyticsPage'
import { AdminCategoriesPage } from '@/features/admin/categories/pages/AdminCategoriesPage'
import { ArticlesPage } from '@/features/admin/content/pages/ArticlesPage'
import { LegalResourcesPage } from '@/features/admin/content/pages/LegalResourcesPage'
import { PagesManagementPage } from '@/features/admin/content/pages/PagesManagementPage'
import { MediaLibraryPage } from '@/features/admin/content/pages/MediaLibraryPage'
import { TagsPage } from '@/features/admin/content/pages/TagsPage'
import { HomepageBuilderPage } from '@/features/admin/website/pages/HomepageBuilderPage'
import { BannersPage } from '@/features/admin/website/pages/BannersPage'
import { MenusPage } from '@/features/admin/website/pages/MenusPage'
import { VisibilityPage } from '@/features/admin/website/pages/VisibilityPage'
import { SeoPage } from '@/features/admin/website/pages/SeoPage'
import { UsersPage } from '@/features/admin/users/pages/UsersPage'
import { RolesPage } from '@/features/admin/users/pages/RolesPage'
import { FeatureFlagsPage } from '@/features/admin/system/pages/FeatureFlagsPage'
import { WebsiteSettingsPage } from '@/features/admin/system/pages/WebsiteSettingsPage'
import { ActivityLogsPage } from '@/features/admin/system/pages/ActivityLogsPage'
import { NotificationsPage } from '@/features/admin/system/pages/NotificationsPage'
import { BackupMaintenancePage } from '@/features/admin/system/pages/BackupMaintenancePage'

export const router = createBrowserRouter([
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminOverviewPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'activities', element: <ActivityLogsPage /> },
      { path: 'categories', element: <AdminCategoriesPage /> },
      { path: 'subcategories', element: <AdminCategoriesPage /> },
      { path: 'articles', element: <ArticlesPage /> },
      { path: 'laws', element: <LegalResourcesPage /> },
      { path: 'pages', element: <PagesManagementPage /> },
      { path: 'tags', element: <TagsPage /> },
      { path: 'media', element: <MediaLibraryPage /> },
      { path: 'homepage-builder', element: <HomepageBuilderPage /> },
      { path: 'sections', element: <HomepageBuilderPage /> },
      { path: 'banners', element: <BannersPage /> },
      { path: 'menus', element: <MenusPage /> },
      { path: 'footer', element: <MenusPage /> },
      { path: 'visibility', element: <VisibilityPage /> },
      { path: 'seo', element: <SeoPage /> },
      { path: 'redirects', element: <SeoPage /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'roles', element: <RolesPage /> },
      { path: 'permissions', element: <RolesPage /> },
      { path: 'user-activity', element: <ActivityLogsPage /> },
      { path: 'feature-flags', element: <FeatureFlagsPage /> },
      { path: 'settings', element: <WebsiteSettingsPage /> },
      { path: 'audit-logs', element: <ActivityLogsPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'backups', element: <BackupMaintenancePage /> },
      { path: 'maintenance', element: <BackupMaintenancePage /> },
    ],
  },
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'courses',
        element: <CoursesPage />,
      },
      {
        path: 'courses/:courseId',
        element: <CourseDetailsPage />,
      },
      {
        path: 'categories',
        element: <CategoriesPage />,
      },
      {
        path: 'categories/:lawSlug',
        element: <LawDetailPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
