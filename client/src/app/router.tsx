import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { HomePage } from '@/features/home/pages/HomePage'
import { CoursesPage } from '@/features/courses/pages/CoursesPage'
import { CourseDetailsPage } from '@/features/courses/pages/CourseDetailsPage'
import { CategoriesPage } from '@/features/categories/pages/CategoriesPage'
import { NotFoundPage } from '@/components/common/NotFoundPage'

export const router = createBrowserRouter([
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
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
