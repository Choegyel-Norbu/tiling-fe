import { Bath, ChefHat, Grid3X3, Sun, Droplets, Wrench } from 'lucide-react';

export const services = [
  {
    id: 'bathroom',
    title: 'Bathroom Tiling',
    description: 'Complete bathroom renovations and tiling services. From floor to ceiling, we ensure a waterproof and stunning finish.',
    icon: Bath,
    materials: ['Ceramic', 'Porcelain', 'Mosaic', 'Natural Stone'],
    timeframe: '3-7 days',
    useCases: ['Full bathroom renovations', 'Shower recess re-tiling', 'Feature walls', 'Floor updates']
  },
  {
    id: 'kitchen',
    title: 'Kitchen Splashbacks',
    description: 'Modern and classic kitchen splashbacks to protect your walls and add style to your cooking space.',
    icon: ChefHat,
    materials: ['Glass', 'Subway Tiles', 'Stone', 'Patterned'],
    timeframe: '1-2 days',
    useCases: ['New kitchen builds', 'Renovations', 'Splashback replacement']
  },
  {
    id: 'floor',
    title: 'Floor Tiling',
    description: 'Durable and beautiful floor tiling for living areas, hallways, and laundries.',
    icon: Grid3X3,
    materials: ['Large Format', 'Timber Look', 'Slate', 'Marble'],
    timeframe: '3-5 days',
    useCases: ['Living rooms', 'Hallways', 'Laundries', 'Garages']
  },
  {
    id: 'outdoor',
    title: 'Outdoor & Pools',
    description: 'Slip-resistant outdoor tiling for patios, balconies, and pool surrounds.',
    icon: Sun,
    materials: ['Travertine', 'Sandstone', 'Anti-slip Porcelain'],
    timeframe: '4-7 days',
    useCases: ['Patios', 'Balconies', 'Pool surrounds', 'Pathways', 'Driveways']
  },
  {
    id: 'waterproofing',
    title: 'Waterproofing',
    description: 'Certified waterproofing services to prevent leaks and structural damage. AS-3740 compliant.',
    icon: Droplets,
    materials: ['Liquid Membrane', 'Sheet Membrane'],
    timeframe: '1-2 days',
    useCases: ['Bathrooms', 'Balconies', 'Laundries', 'Retaining walls']
  },
  {
    id: 'minor',
    title: 'Minor Works',
    description: 'Grout restoration, tile repairs, silicone replacement, and sealing.',
    icon: Wrench,
    materials: ['Epoxy Grout', 'Silicone'],
    timeframe: '1 day',
    useCases: ['Cracked tile repair', 'Leaking showers', 'Mouldy grout', 'Silicone refresh']
  },
];
