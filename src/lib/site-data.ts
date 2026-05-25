import { BriefcaseBusiness, Building2, Gavel, Handshake, Landmark, Scale, ShieldCheck, UsersRound } from 'lucide-react';

export const brand = {
  blue: '#2e3192',
  gold: '#ab812b',
};

export const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/practice-areas', label: 'Practice Areas' },
  { href: '/team', label: 'Our Team' },
  { href: '/case-results', label: 'Case Results' },
  { href: '/insights', label: 'Insights' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
];

export const images = {
  hero: '/images/Main-HomeBanner-Herrolegal_office.jpeg',
  skyline: '/images/Nairobi_skyline_view.jpeg',
  aboutno: '/images/home-about-banner.jpg',
  signing: '/images/Black_lady_signing_document.jpeg',
  realEstate: '/images/Conveyancing_Real_Estate.jpeg',
  corporate: '/images/Corporate_commercial_law_busine.jpeg',
  corporateAlt: '/images/Corporate_commercial_law_busines.jpeg',
  disputes: '/images/Dispute_ResolutionLitigation.jpeg',
  fam: '/images/Family_Law_Compassionate.jpg',
  casesight: '/images/Milimani-law-courts.jpg',
  family: '/images/Family_Law_Compassionate_lega.jpeg',
  office: '/images/home-hero-banner.png',
  founder: '/images/Sharon-Nyaera-Founder.jpg',
  judiciaryke: '/images/Judiciary.jpg',
  proenv: '/images/real-estate-law.jpg',		  
  milicourts: '/images/Milimani-law-courtsv2.jpg',		
};

export const practiceAreas = [
  {
    title: 'Real Estate & Conveyancing',
    slug: 'real-estate-conveyancing',
    icon: Building2,
    image: images.realEstate,
    summary: 'Sale agreements, transfers, leases, due diligence, sectional properties, development agreements and property financing.',
    services: ['Sale and purchase agreements', 'Property transfers', 'Lease agreements', 'Due diligence investigations', 'Sectional properties registration', 'Joint venture agreements'],
  },
  {
    title: 'Commercial & Corporate Law',
    slug: 'commercial-corporate-law',
    icon: BriefcaseBusiness,
    image: images.corporate,
    summary: 'Company registration, governance, shareholder agreements, commercial contracts, compliance and business structuring.',
    services: ['Company registration', 'Corporate governance', 'Shareholder agreements', 'Business structuring', 'Commercial contracts', 'Regulatory compliance'],
  },
  {
    title: 'Civil Litigation & Dispute Resolution',
    slug: 'civil-litigation-dispute-resolution',
    icon: Gavel,
    image: images.disputes,
    summary: 'Court and tribunal representation for contract disputes, debt recovery, land disputes, arbitration and mediation.',
    services: ['Contract disputes', 'Debt recovery', 'Commercial litigation', 'Land disputes', 'Arbitration and mediation', 'Tribunal representation'],
  },
  {
    title: 'Employment & Labour Law',
    slug: 'employment-labour-law',
    icon: UsersRound,
    image: images.signing,
    summary: 'Employment contracts, HR compliance, wrongful termination claims, workplace disputes and labour advisory services.',
    services: ['Employment contracts', 'HR compliance', 'Workplace policies', 'Wrongful termination claims', 'Workplace disputes', 'Labour advisory'],
  },
  {
    title: 'Family Law & Succession',
    slug: 'family-law-succession',
    icon: Scale,
    image: images.fam,
    summary: 'Probate, estate planning, wills, administration, divorce, custody and maintenance matters handled with discretion.',
    services: ['Probate and administration', 'Estate planning', 'Wills drafting', 'Divorce matters', 'Child custody', 'Maintenance matters'],
  },
  {
    title: 'Legal Consultancy & Compliance',
    slug: 'legal-consultancy-compliance',
    icon: ShieldCheck,
    image: images.skyline,
    summary: 'Legal audits, compliance reviews, immigration support, IP advisory and ongoing business legal support.',
    services: ['Legal audits', 'Contract drafting', 'Risk management', 'Regulatory compliance', 'Immigration support', 'IP advisory'],
  },
];

export const teamMembers = [
  { name: 'Sharon Nyaera Ogega', role: 'Founding Partner', focus: 'Real estate, conveyancing, commercial advisory and dispute resolution.', image: images.founder },
  { name: 'Associate Advocate', role: 'Property & Transactions', focus: 'Due diligence, transfers, leases and sectional property documentation.', image: images.milicourts },
  { name: 'Legal Consultant', role: 'Corporate & Compliance', focus: 'Corporate governance, business structuring, contracts and regulatory support.', image: images.judiciaryke },
];

export const caseResults = [
  { title: 'Developer transaction support', metric: 'Multi-party', body: 'Structured transaction documentation, due diligence and completion support for a property development mandate.' },
  { title: 'Commercial dispute resolution', metric: 'Resolved', body: 'Supported negotiation strategy and documentation review to reduce litigation exposure for a business client.' },
  { title: 'Property transfer advisory', metric: 'End-to-end', body: 'Guided a property owner through due diligence, transfer documentation and registration process coordination.' },
];

export const insights = [
  { title: 'Understanding Sectional Properties in Kenya', category: 'Property Law', image: images.realEstate, excerpt: 'A practical guide for developers, investors and property buyers navigating sectional title structures.' },
  { title: 'Legal Due Diligence Before Buying Land', category: 'Conveyancing', image: images.signing, excerpt: 'Key checks every buyer should complete before committing funds to a land transaction.' },
  { title: 'Protecting Developers in Joint Venture Agreements', category: 'Commercial Law', image: images.corporate, excerpt: 'Important legal clauses that reduce ambiguity in developer-investor partnerships.' },
];

export const contact = {
  address: 'Shelter Afrique Building, Mamlaka Road, 3rd Floor, Room 4, Nairobi',
  email: 'info@nyaeraogegaadvocates.com',
  phone: '+254 791 646 341',
  whatsapp: 'https://wa.me/254791646341',
};

export const values = [
  { title: 'Industry-focused expertise', icon: Landmark },
  { title: 'Fast responsive communication', icon: Handshake },
  { title: 'Strategic practical solutions', icon: ShieldCheck },
  { title: 'Confidential professional service', icon: Scale },
];
