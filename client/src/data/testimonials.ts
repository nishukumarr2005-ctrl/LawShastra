import type { Testimonial } from '@/types'

export const testimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Emily Watson',
    role: 'Frontend Engineer',
    company: 'Linear',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    content: 'The React architecture curriculum completely leveled up my career. Within 4 months, I transitioned from junior to senior engineer at a high-growth tech startup.',
    rating: 5,
    courseTaken: 'Complete React & Next.js Professional Development',
  },
  {
    id: 'test-2',
    name: 'Michael Chang',
    role: 'Product Designer',
    company: 'DoorDash',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    content: 'Elena’s UI/UX course is easily the most practical design system guide on the web. It doesn’t just show pretty Figma frames—it teaches real enterprise tokens.',
    rating: 5,
    courseTaken: 'UI/UX Design Masterclass',
  },
  {
    id: 'test-3',
    name: 'Kavita Patel',
    role: 'ML Ops Engineer',
    company: 'Databricks',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    content: 'The Machine Learning and Python data science courses are crisp, rigorous, and packed with practical labs. Truly top-tier engineering content without the fluff.',
    rating: 5,
    courseTaken: 'Python for Data Science & Pandas',
  },
]
