import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="py-24 text-center bg-[#FFFDF8] min-h-[60vh] flex flex-col items-center justify-center">
      <span className="text-4xl font-extrabold text-[#FF8A45] mb-2">404</span>
      <h2 className="text-2xl font-bold text-[#25232B] mb-2">Page Not Found</h2>
      <p className="text-sm text-[#77747F] mb-6">
        The page you are looking for does not exist.
      </p>
      <Link to="/">
        <Button variant="primary" size="md">
          Back to EduSphere Home
        </Button>
      </Link>
    </div>
  )
}
