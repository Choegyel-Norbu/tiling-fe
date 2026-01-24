import { useEffect } from 'react';

/**
 * SEO component for managing page-specific meta tags
 * Updates document title and meta tags dynamically per page
 * 
 * @param {Object} props
 * @param {string} props.title - Page title (will be appended with site name)
 * @param {string} props.description - Meta description for the page
 * @param {string} props.canonical - Canonical URL path (e.g., "/services")
 * @param {string} props.type - Open Graph type (default: "website")
 * @param {string} props.image - Open Graph image URL
 * @param {Object} props.schema - Additional JSON-LD schema object
 */
export function SEO({
  title,
  description,
  canonical,
  type = 'website',
  image = '/og-image.jpg',
  schema = null,
}) {
  const siteName = 'Himalayan Tiling';
  const siteUrl = 'https://himalayantiling.com';
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} | Professional Tiling Services Perth`;
  const fullUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;
  const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Helper to update or create meta tag
    const setMetaTag = (attribute, value, content) => {
      let element = document.querySelector(`meta[${attribute}="${value}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, value);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update meta description
    if (description) {
      setMetaTag('name', 'description', description);
      setMetaTag('property', 'og:description', description);
      setMetaTag('name', 'twitter:description', description);
    }

    // Update title meta tags
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('name', 'twitter:title', fullTitle);

    // Update URL meta tags
    setMetaTag('property', 'og:url', fullUrl);
    setMetaTag('name', 'twitter:url', fullUrl);

    // Update image meta tags
    setMetaTag('property', 'og:image', fullImage);
    setMetaTag('name', 'twitter:image', fullImage);

    // Update type
    setMetaTag('property', 'og:type', type);

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', fullUrl);

    // Add page-specific schema if provided
    if (schema) {
      const existingSchema = document.getElementById('page-schema');
      if (existingSchema) {
        existingSchema.remove();
      }
      const schemaScript = document.createElement('script');
      schemaScript.id = 'page-schema';
      schemaScript.type = 'application/ld+json';
      schemaScript.textContent = JSON.stringify(schema);
      document.head.appendChild(schemaScript);
    }

    // Cleanup on unmount
    return () => {
      const pageSchema = document.getElementById('page-schema');
      if (pageSchema) {
        pageSchema.remove();
      }
    };
  }, [fullTitle, description, fullUrl, fullImage, type, schema]);

  return null; // This component doesn't render anything
}

// Pre-configured SEO data for each page
export const SEO_CONFIG = {
  home: {
    title: null, // Uses default
    description: "Perth's #1 rated tiling specialists. Expert bathroom renovations, waterproofing, screeding, grouting & vinyl flooring installation. 7-year warranty. Free inspections. Fully licensed.",
    canonical: '/',
  },
  services: {
    title: 'Our Services',
    description: 'Professional tiling services in Perth including bathroom renovations, waterproofing, screeding, grouting, and vinyl flooring installation. Quality workmanship guaranteed.',
    canonical: '/services',
  },
  booking: {
    title: 'Book a Service',
    description: 'Book your tiling service online. Free inspections and quotes available. Professional tiling, waterproofing, and flooring services in Perth.',
    canonical: '/booking',
  },
  gallery: {
    title: 'Project Gallery',
    description: 'Browse our portfolio of completed tiling projects in Perth. Bathroom renovations, floor tiling, waterproofing, and more. See our quality craftsmanship.',
    canonical: '/gallery',
  },
  about: {
    title: 'About Us',
    description: 'Learn about Himalayan Tiling - Perth\'s trusted tiling experts. Over 2 years experience, fully licensed, and committed to quality craftsmanship.',
    canonical: '/about',
  },
  contact: {
    title: 'Contact Us',
    description: 'Get in touch with Himalayan Tiling for a free quote. Professional tiling services across Perth. Call us or fill out our contact form.',
    canonical: '/contact',
  },
  reviews: {
    title: 'Customer Reviews',
    description: 'Read what our customers say about Himalayan Tiling. 5-star rated tiling services in Perth. Trusted by homeowners across Greater Perth.',
    canonical: '/reviews',
  },
};

export default SEO;

