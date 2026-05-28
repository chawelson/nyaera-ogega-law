import { contact, practiceAreas, siteUrl, teamMembers } from '@/lib/site-data';

/**
 * JSON-LD structured data for Google Search.
 * Outputs LegalService + LocalBusiness + Attorney schema.
 * Placed in the root layout so it appears on every page.
 */
export function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      // ── 1. Law Firm as LegalService + LocalBusiness ──────────────────────
      {
        '@type': ['LegalService', 'LocalBusiness'],
        '@id': `${siteUrl}/#firm`,
        name: 'Nyaera Ogega & Co. Advocates',
        alternateName: 'Nyaera Ogega Advocates',
        description:
          'Modern legal advisors in Nairobi specialising in real estate, conveyancing, commercial law, civil litigation, employment law, family law and legal consultancy across Kenya.',
        url: siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/logos/Nyaera-Ogega-New-Logo.png`,
        },
        image: `${siteUrl}/images/Main-HomeBanner-Herrolegal_office.jpeg`,
        telephone: contact.phone,
        email: contact.email,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Shelter Afrique Building, Mamlaka Road, 3rd Floor, Room 4',
          addressLocality: 'Nairobi',
          addressRegion: 'Nairobi County',
          addressCountry: 'KE',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: -1.2895,
          longitude: 36.8219,
        },
        hasMap: 'https://maps.google.com/?q=Shelter+Afrique+Building+Mamlaka+Road+Nairobi',
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '08:00',
            closes: '17:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Saturday'],
            opens: '09:00',
            closes: '13:00',
          },
        ],
        priceRange: '$$',
        currenciesAccepted: 'KES',
        areaServed: [
          { '@type': 'Country', name: 'Kenya' },
          { '@type': 'City', name: 'Nairobi' },
        ],
        serviceType: practiceAreas.map((a) => a.title),
        sameAs: [
          contact.whatsapp,
        ],
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: contact.phone,
            contactType: 'customer service',
            availableLanguage: ['English', 'Swahili'],
            areaServed: 'KE',
          },
          {
            '@type': 'ContactPoint',
            email: contact.email,
            contactType: 'customer service',
          },
        ],
        founder: {
          '@type': 'Person',
          '@id': `${siteUrl}/#sharon`,
          name: teamMembers[0].name,
          jobTitle: teamMembers[0].role,
          worksFor: { '@id': `${siteUrl}/#firm` },
          image: `${siteUrl}${teamMembers[0].image}`,
        },
      },

      // ── 2. Website entity ─────────────────────────────────────────────────
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'Nyaera Ogega & Co. Advocates',
        publisher: { '@id': `${siteUrl}/#firm` },
        inLanguage: 'en-KE',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/insights?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },

      // ── 3. Individual services ────────────────────────────────────────────
      ...practiceAreas.map((area) => ({
        '@type': 'Service',
        '@id': `${siteUrl}/practice-areas#${area.slug}`,
        name: area.title,
        description: area.summary,
        provider: { '@id': `${siteUrl}/#firm` },
        areaServed: { '@type': 'Country', name: 'Kenya' },
        url: `${siteUrl}/practice-areas#${area.slug}`,
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
