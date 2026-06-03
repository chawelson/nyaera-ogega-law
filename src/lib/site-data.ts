import { BriefcaseBusiness, Building2, Gavel, Handshake, Landmark, Scale, ShieldCheck, UsersRound, FileSearch, MessagesSquare, Lightbulb, Trophy } from 'lucide-react';

export const siteUrl = 'https://nyaeraogegaadvocates.com';

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
  courts: '/images/court-of-appeal.jpeg',
};

export const practiceAreas = [
  {
    title: 'Real Estate & Conveyancing',
    slug: 'real-estate-conveyancing',
    icon: Building2,
    image: images.realEstate,
    summary: 'Sale agreements, transfers, leases, due diligence, sectional properties, development agreements and property financing.',
    description: 'Our Real Estate & Conveyancing practice is the cornerstone of what we do. We act for developers, investors, financiers and individual buyers navigating Kenya\'s complex property market. From initial due diligence to final registration, we handle every legal step with precision — ensuring your transaction is properly structured, your title is clean, and your interests are protected. We have extensive experience with both freehold and leasehold properties, sectional titles, and large-scale development projects.',
    services: [
      'Sale and purchase agreements',
      'Property transfers & title registration',
      'Lease agreements & tenancy matters',
      'Due diligence investigations',
      'Sectional properties registration',
      'Joint venture & development agreements',
      'Property financing & charge documents',
      'Caution & inhibition registrations',
    ],
    faqs: [
      { q: 'How long does a property transfer take in Kenya?', a: 'A straightforward transfer typically takes 30–60 days from signing of sale agreement to registration. Delays can occur due to land control board approval, stamp duty assessment, or title verification. We keep the process moving and communicate proactively.' },
      { q: 'What is due diligence and why is it necessary?', a: 'Due diligence involves verifying ownership, checking for encumbrances, confirming land rates and rent are paid, and ensuring the property matches its documents. It protects you from fraud, disputes and hidden liabilities before you commit funds.' },
      { q: 'Do I need a lawyer for a property transaction?', a: 'Yes. In Kenya, property transactions require legal documentation prepared and witnessed by an advocate. Beyond legal requirement, a lawyer protects your interests and ensures the transaction is properly structured and registered.' },
    ],
  },
  {
    title: 'Commercial & Corporate Law',
    slug: 'commercial-corporate-law',
    icon: BriefcaseBusiness,
    image: images.corporate,
    summary: 'Company registration, governance, shareholder agreements, commercial contracts, compliance and business structuring.',
    description: 'We provide end-to-end legal support for businesses at every stage — from incorporation and structuring through to commercial contracts, governance frameworks and regulatory compliance. Our team understands the commercial pressures businesses face, and we deliver legal advice that is practical, timely and focused on enabling growth rather than creating obstacles. Whether you are a startup, SME or established enterprise, we tailor our corporate legal support to your specific needs.',
    services: [
      'Company registration & incorporation',
      'Corporate governance frameworks',
      'Shareholder & partnership agreements',
      'Business structuring & restructuring',
      'Commercial contracts & negotiations',
      'Regulatory compliance advisory',
      'Mergers & acquisitions support',
      'Board resolutions & company secretarial',
    ],
    faqs: [
      { q: 'How long does company registration take in Kenya?', a: 'Company registration via the eCitizen portal typically takes 3–5 business days once all documents are in order. We handle the entire process — name search, document preparation, filing and certificate collection.' },
      { q: 'What is the difference between a shareholder agreement and articles of association?', a: 'Articles of association are public constitutional documents governing internal company rules. A shareholder agreement is a private contract between shareholders addressing profit sharing, exit rights, decision-making and dispute resolution — essential for protecting minority shareholders.' },
      { q: 'Do I need legal help for commercial contracts?', a: 'Yes. Poorly drafted contracts are one of the biggest sources of business disputes. We draft and review commercial agreements to ensure your rights are protected, obligations are clear, and exit mechanisms are defined.' },
    ],
  },
  {
    title: 'Civil Litigation & Dispute Resolution',
    slug: 'civil-litigation-dispute-resolution',
    icon: Gavel,
    image: images.disputes,
    summary: 'Court and tribunal representation for contract disputes, debt recovery, land disputes, arbitration and mediation.',
    description: 'When disputes arise, you need advocates who combine sharp legal strategy with courtroom experience. We represent clients before the High Court, magistrate courts, the Environment and Land Court, Employment and Labour Relations Court, and various tribunals. Our approach prioritises practical resolution — we explore negotiation, mediation and arbitration before litigation where appropriate — but when court action is necessary, we pursue your interests with determination and expertise.',
    services: [
      'Contract & commercial disputes',
      'Debt recovery & enforcement',
      'Land & boundary disputes',
      'Commercial litigation',
      'Arbitration & mediation',
      'Tribunal representation',
      'Injunctions & urgent court orders',
      'Judgment enforcement',
    ],
    faqs: [
      { q: 'How long does litigation take in Kenya?', a: 'Civil cases in Kenya can take 1–5 years depending on complexity and the court\'s caseload. We always explore faster alternatives — mediation, arbitration and negotiated settlement — where they serve your interests. Many disputes are resolved before trial.' },
      { q: 'What is the difference between mediation and arbitration?', a: 'Mediation is a facilitated negotiation where a neutral mediator helps parties reach agreement — the outcome is voluntary. Arbitration is a formal private process where an arbitrator makes a binding decision. Both are faster and cheaper than court litigation.' },
      { q: 'Can I recover legal costs from the other party?', a: 'In Kenya, courts can award costs to the winning party, but the award rarely covers 100% of actual legal costs. We advise clients on realistic cost expectations and factor this into our strategic advice.' },
    ],
  },
  {
    title: 'Employment & Labour Law',
    slug: 'employment-labour-law',
    icon: UsersRound,
    image: images.signing,
    summary: 'Employment contracts, HR compliance, wrongful termination claims, workplace disputes and labour advisory services.',
    description: 'Employment law in Kenya is increasingly complex, with employers facing growing obligations under the Employment Act, Labour Relations Act and related regulations. We advise both employers and employees — drafting compliant employment contracts, developing workplace policies, managing disciplinary processes, and representing clients in unfair termination and workplace dispute matters before the Employment and Labour Relations Court. We help employers build compliant HR frameworks that protect their business, and employees understand and enforce their rights.',
    services: [
      'Employment contracts & offer letters',
      'HR policies & staff handbooks',
      'Workplace disciplinary procedures',
      'Wrongful termination claims',
      'Workplace dispute resolution',
      'Labour advisory & compliance audits',
      'Redundancy & retrenchment procedures',
      'ELRC representation',
    ],
    faqs: [
      { q: 'What are the legal requirements for terminating an employee in Kenya?', a: 'The Employment Act requires a valid reason, notice (or payment in lieu), and a fair hearing. Terminations without following due process risk unfair termination claims at the ELRC. We advise employers on compliant termination procedures.' },
      { q: 'Can an employee sue for wrongful dismissal in Kenya?', a: 'Yes. Employees can file claims at the Employment and Labour Relations Court. Remedies include reinstatement and/or compensation of up to 12 months\' gross pay. We represent both employees and employers in these matters.' },
      { q: 'Do small businesses need employment contracts?', a: 'Yes. Even for casual workers, Kenya\'s Employment Act establishes minimum rights. Formal contracts protect both employer and employee by clarifying terms, limiting disputes, and ensuring compliance with statutory obligations.' },
    ],
  },
  {
    title: 'Family Law & Succession',
    slug: 'family-law-succession',
    icon: Scale,
    image: images.fam,
    summary: 'Probate, estate planning, wills, administration, divorce, custody and maintenance matters handled with discretion.',
    description: 'Family and succession matters require both legal expertise and genuine sensitivity to the human dimension. We handle these cases with the utmost discretion, providing clients with clear legal guidance while navigating emotionally complex circumstances. From estate planning and will drafting to probate administration, divorce and child custody, we protect our clients\' interests and help them make informed decisions. Our team brings a calm, strategic approach to matters that can feel overwhelming.',
    services: [
      'Probate & letters of administration',
      'Estate planning & asset protection',
      'Wills drafting & execution',
      'Grant of probate applications',
      'Divorce & separation matters',
      'Child custody & guardianship',
      'Maintenance & financial orders',
      'Succession disputes',
    ],
    faqs: [
      { q: 'What happens if someone dies without a will in Kenya?', a: 'Dying intestate (without a will) means the estate is distributed under the Law of Succession Act, which may not reflect the deceased\'s wishes. The court appoints an administrator to manage the estate. This process is more complex, time-consuming and open to disputes — we strongly recommend preparing a will.' },
      { q: 'How long does probate take in Kenya?', a: 'Uncontested probate typically takes 6–12 months from filing to confirmation of grant. Contested estates can take much longer. We prepare thorough applications that minimise delays and handle all court filings on your behalf.' },
      { q: 'What are the grounds for divorce in Kenya?', a: 'Under the Marriage Act 2014, the sole ground for divorce is irretrievable breakdown of marriage. This can be demonstrated through separation, adultery, cruelty, or unreasonable behaviour. We guide clients through the process with care and professionalism.' },
    ],
  },
  {
    title: 'Legal Consultancy & Compliance',
    slug: 'legal-consultancy-compliance',
    icon: ShieldCheck,
    image: images.skyline,
    summary: 'Legal audits, compliance reviews, immigration support, IP advisory and ongoing business legal support.',
    description: 'Beyond transactional and litigation work, we provide ongoing legal advisory and compliance support to businesses and individuals. Whether you need a contract reviewed, a compliance audit, immigration guidance, or IP protection advice, our team offers responsive, practical counsel. We can act as your retained legal advisor — available when you need us, with a deep understanding of your business context — or engage on specific advisory mandates.',
    services: [
      'Legal audits & risk reviews',
      'Contract drafting & review',
      'Regulatory compliance advisory',
      'Immigration & work permit support',
      'Intellectual property advisory',
      'Business licensing & permits',
      'Data protection compliance',
      'Ongoing business legal retainer',
    ],
    faqs: [
      { q: 'What is a legal retainer and how does it work?', a: 'A legal retainer is an arrangement where you pay a monthly fee for access to legal advice and agreed services. It gives businesses predictable legal costs and ensures you have immediate access to counsel when issues arise — rather than scrambling to find a lawyer in a crisis.' },
      { q: 'Do I need a data protection policy for my business?', a: 'Yes. The Data Protection Act 2019 requires businesses that process personal data to implement appropriate safeguards, appoint a data protection officer where required, and register with the Office of the Data Protection Commissioner. Penalties for non-compliance can be significant.' },
      { q: 'Can you help with work permits and immigration?', a: 'Yes. We assist employers and individuals with work permit applications, entry permit variations, and immigration compliance. Kenya\'s Department of Immigration has strict timelines and documentation requirements — we ensure applications are complete and properly filed.' },
    ],
  },
];

export const teamMembers = [
  {
    name: 'Sharon Nyaera Ogega',
    role: 'Founding Partner',
    focus: 'Real estate, conveyancing, commercial advisory and dispute resolution.',
    bio: 'Sharon founded the firm with a vision to deliver high-quality, commercially focused legal services to property investors, developers and businesses in Kenya. With deep expertise in conveyancing and commercial law, she leads complex transactions and advisory mandates, bringing both legal precision and practical business insight to every matter.',
    image: images.founder,
  },
  {
    name: 'Associate Advocate',
    role: 'Property & Transactions',
    focus: 'Due diligence, transfers, leases and sectional property documentation.',
    bio: 'Specialising in property law and transactional support, our associate handles the day-to-day delivery of conveyancing and real estate mandates. Meticulous and responsive, they ensure that every transaction is progressed efficiently and that clients are kept informed at every stage.',
    image: images.milicourts,
  },
  {
    name: 'Legal Consultant',
    role: 'Corporate & Compliance',
    focus: 'Corporate governance, business structuring, contracts and regulatory support.',
    bio: 'Our legal consultant brings commercial and regulatory expertise to support corporate clients. From company formation through to ongoing compliance advisory, they provide practical guidance that helps businesses operate confidently within Kenya\'s regulatory environment.',
    image: images.judiciaryke,
  },
];

export const caseResults = [
  {
    title: 'Developer transaction support',
    metric: 'Multi-party',
    body: 'Structured transaction documentation, due diligence and completion support for a property development mandate involving multiple landowners, a financier and a developer client.',
  },
  {
    title: 'Commercial dispute resolution',
    metric: 'Resolved',
    body: 'Supported negotiation strategy and documentation review to reduce litigation exposure for a business client facing a contract dispute, achieving settlement without court proceedings.',
  },
  {
    title: 'Property transfer advisory',
    metric: 'End-to-end',
    body: 'Guided a property owner through due diligence, transfer documentation and registration process coordination, ensuring a clean title transfer within the agreed timeline.',
  },
];

export const insights = [
  {
    title: 'Understanding Sectional Properties in Kenya',
    category: 'Property Law',
    image: images.realEstate,
    excerpt: 'A practical guide for developers, investors and property buyers navigating sectional title structures and the legal framework governing apartment ownership in Kenya.',
  },
  {
    title: 'Legal Due Diligence Before Buying Land',
    category: 'Conveyancing',
    image: images.signing,
    excerpt: 'Key checks every buyer should complete before committing funds to a land transaction in Kenya — including title search, rates clearance and land control board approval.',
  },
  {
    title: 'Protecting Developers in Joint Venture Agreements',
    category: 'Commercial Law',
    image: images.corporate,
    excerpt: 'Important legal clauses that reduce ambiguity, protect intellectual contribution and define exit mechanisms in developer-investor partnerships.',
  },
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

export const stats = [
  { value: '6', label: 'Practice Areas', suffix: '' },
  { value: '5', label: 'Years of Practice', suffix: '+' },
  { value: '100', label: 'Client Satisfaction', suffix: '%' },
  { value: '24', label: 'Hour Response Time', suffix: 'h' },
];

export const process = [
  {
    step: '01',
    title: 'Initial Consultation',
    description: 'We begin with a confidential consultation to understand your situation, objectives and the legal issues involved. No jargon — just clear, honest assessment.',
    icon: MessagesSquare,
  },
  {
    step: '02',
    title: 'Strategy & Advice',
    description: 'We analyse your matter thoroughly and present a clear legal strategy — outlining your options, risks, timelines and costs so you can make informed decisions.',
    icon: FileSearch,
  },
  {
    step: '03',
    title: 'Execution',
    description: 'We handle every legal step with precision — drafting documents, filing, negotiating, appearing in court or completing transactions on your behalf.',
    icon: Lightbulb,
  },
  {
    step: '04',
    title: 'Resolution',
    description: 'We see every matter through to conclusion — whether that is a completed transaction, a favourable settlement, a court judgment or a compliance framework.',
    icon: Trophy,
  },
];

export const testimonials = [
  {
    quote: 'Nyaera Ogega & Co. handled our property transaction with exceptional professionalism. They kept us informed every step of the way and completed the transfer smoothly. I would not hesitate to recommend them.',
    author: 'Property Developer',
    location: 'Nairobi',
    area: 'Real Estate & Conveyancing',
  },
  {
    quote: 'We engaged the firm for our company restructuring and commercial contract work. The advice was practical, timely and commercially sharp. They understand business, not just law.',
    author: 'Business Director',
    location: 'Westlands, Nairobi',
    area: 'Commercial & Corporate Law',
  },
  {
    quote: 'I came to Sharon with a complex estate matter that had been dragging on for months. Within weeks she had a clear plan, communicated it simply, and began delivering results. Outstanding service.',
    author: 'Estate Client',
    location: 'Karen, Nairobi',
    area: 'Family Law & Succession',
  },
];

export const whyUs = [
  {
    title: 'Property & Commercial Focus',
    description: 'We are specialists in real estate and commercial law — not generalists. Our depth of expertise in these areas means better outcomes for clients with property and business legal needs.',
    icon: Building2,
  },
  {
    title: 'Responsive Communication',
    description: 'We commit to responding within 24 hours. Clients always know the status of their matter and can reach their advocate directly — no gatekeeping.',
    icon: MessagesSquare,
  },
  {
    title: 'Practical, Commercial Advice',
    description: 'Our advice is designed to help you make decisions and move forward — not to hedge every outcome with endless caveats. We tell you what we think and why.',
    icon: Lightbulb,
  },
  {
    title: 'Strict Confidentiality',
    description: 'Every client matter is handled with complete discretion. We maintain professional privilege on all communications and never disclose client information.',
    icon: ShieldCheck,
  },
];
