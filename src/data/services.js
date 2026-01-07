import { Grid3X3, Droplets, Layers, Paintbrush, Square } from 'lucide-react';

export const services = [
  {
    id: 'tiling-renovation',
    title: 'Tiling and Renovation',
    description: 'Complete tiling and renovation services for bathrooms, kitchens, and all interior spaces. Expert installation with attention to detail and quality finishes.',
    icon: Grid3X3,
    materials: ['Ceramic', 'Porcelain', 'Mosaic', 'Natural Stone', 'Large Format Tiles'],
    timeframe: '3-10 days',
    useCases: ['Bathroom renovations', 'Kitchen renovations', 'Floor tiling', 'Wall tiling', 'Complete home renovations']
  },
  {
    id: 'waterproofing',
    title: 'Waterproofing',
    description: 'Certified waterproofing services to prevent leaks and structural damage. AS-3740 compliant with professional membrane application.',
    icon: Droplets,
    materials: ['Liquid Membrane', 'Sheet Membrane', 'Waterproofing Systems'],
    timeframe: '1-3 days',
    useCases: ['Bathrooms', 'Showers', 'Balconies', 'Laundries', 'Wet areas', 'Retaining walls']
  },
  {
    id: 'screeding',
    title: 'Screeding',
    description: 'Professional floor screeding services for level, smooth surfaces ready for tiling or flooring installation. Perfect base preparation.',
    icon: Layers,
    materials: ['Cement Screed', 'Self-Leveling Compound', 'Sand & Cement'],
    timeframe: '1-2 days',
    useCases: ['Floor leveling', 'Base preparation', 'Uneven floor correction', 'New construction', 'Renovation projects']
  },
  {
    id: 'grouting',
    title: 'Grouting',
    description: 'Expert grouting services including new installations, restoration, and maintenance. Quality grout selection and professional application.',
    icon: Paintbrush,
    materials: ['Cement Grout', 'Epoxy Grout', 'Sanded Grout', 'Unsanded Grout'],
    timeframe: '1-2 days',
    useCases: ['New tile installations', 'Grout restoration', 'Mouldy grout replacement', 'Color matching', 'Waterproof grouting']
  },
  {
    id: 'vinyl-hybrid-flooring',
    title: 'Vinyls and Hybrid Flooring',
    description: 'Professional installation of luxury vinyl planks (LVP), hybrid flooring, and vinyl tiles. Durable, waterproof, and stylish flooring solutions.',
    icon: Square,
    materials: ['Luxury Vinyl Planks (LVP)', 'Hybrid Flooring', 'Vinyl Tiles', 'SPC Flooring'],
    timeframe: '2-5 days',
    useCases: ['Living areas', 'Kitchens', 'Bathrooms', 'Bedrooms', 'Commercial spaces', 'Waterproof flooring needs']
  },
];
