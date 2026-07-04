/**
 * Sample PDF Generator for Nyaera Ogega & Co. Advocates
 * 
 * Generates 9 sample legal document PDFs for testing the marketplace.
 * Run with: node scripts/generate-sample-pdfs.mjs
 */

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'documents');

// ── Helper: Create a page with header, footer, and body text ────────
async function createDocument(title, pages, options = {}) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontMono = await doc.embedFont(StandardFonts.Courier);

  const { 
    subtitle = '', 
    reference = '',
    parties = [],
    clauses = [],
    schedules = [],
    footerText = 'Nyaera Ogega & Co. Advocates | Shelter Afrique Building, Mamlaka Road, 3rd Floor, Room 4, Nairobi | info@nyaeraogegaadvocates.com',
  } = options;

  for (let i = 0; i < pages; i++) {
    const page = doc.addPage([612, 792]); // US Letter
    const { width, height } = page.getSize();
    const margin = 72;
    const contentWidth = width - 2 * margin;
    let y = height - margin;

    // ── Header line ──
    page.drawLine({
      start: { x: margin, y: height - 50 },
      end: { x: width - margin, y: height - 50 },
      thickness: 1,
      color: rgb(0.18, 0.19, 0.57),
    });

    // ── Title ──
    page.drawText(title, {
      x: margin,
      y: height - 80,
      size: 18,
      font: fontBold,
      color: rgb(0.18, 0.19, 0.57),
    });

    if (subtitle) {
      page.drawText(subtitle, {
        x: margin,
        y: height - 102,
        size: 11,
        font,
        color: rgb(0.4, 0.4, 0.4),
      });
    }

    if (reference) {
      page.drawText(`Ref: ${reference}`, {
        x: margin,
        y: height - 120,
        size: 8,
        font: fontMono,
        color: rgb(0.5, 0.5, 0.5),
      });
    }

    // ── Page number ──
    page.drawText(`Page ${i + 1} of ${pages}`, {
      x: width - margin - 60,
      y: 30,
      size: 8,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });

    // ── Footer line ──
    page.drawLine({
      start: { x: margin, y: 45 },
      end: { x: width - margin, y: 45 },
      thickness: 0.5,
      color: rgb(0.7, 0.7, 0.7),
    });

    page.drawText(footerText, {
      x: margin,
      y: 32,
      size: 7,
      font,
      color: rgb(0.6, 0.6, 0.6),
    });

    // ── Body content ──
    const bodyStartY = height - 145;
    let bodyY = bodyStartY;
    const lineHeight = 14;

    function addText(text, opts = {}) {
      const f = opts.bold ? fontBold : font;
      const s = opts.size || 10;
      const c = opts.color || rgb(0.15, 0.15, 0.15);
      const indent = opts.indent || 0;
      const maxWidth = contentWidth - indent;

      // Word wrap
      const words = text.split(' ');
      let line = '';
      for (const word of words) {
        const testLine = line ? `${line} ${word}` : word;
        const tw = f.widthOfTextAtSize(testLine, s);
        if (tw > maxWidth && line) {
          page.drawText(line, {
            x: margin + indent,
            y: bodyY,
            size: s,
            font: f,
            color: c,
          });
          bodyY -= lineHeight;
          line = word;
        } else {
          line = testLine;
        }
      }
      if (line) {
        page.drawText(line, {
          x: margin + indent,
          y: bodyY,
          size: s,
          font: f,
          color: c,
        });
        bodyY -= lineHeight;
      }
    }

    function addBlank() {
      bodyY -= lineHeight * 0.5;
    }

    // ── Page-specific content ──
    if (i === 0) {
      // First page: parties and recitals
      if (parties.length > 0) {
        addText('THIS AGREEMENT is made on this ______ day of ________________, 20____', { size: 10 });
        addBlank();
        addText('BETWEEN:', { bold: true, size: 11 });
        addBlank();
        parties.forEach((p, idx) => {
          addText(`${idx + 1}. ${p.name}`, { bold: true, indent: 20 });
          if (p.description) {
            addText(`   ${p.description}`, { indent: 20, size: 9 });
          }
          addBlank();
        });
        addBlank();
      }

      if (clauses.length > 0) {
        addText('NOW THEREFORE, the parties agree as follows:', { size: 10 });
        addBlank();
        clauses.slice(0, Math.min(clauses.length, 8)).forEach((clause, idx) => {
          const clauseText = `${idx + 1}. ${clause.title}`;
          addText(clauseText, { bold: true, size: 10 });
          if (clause.body) {
            addText(clause.body, { indent: 15, size: 9 });
          }
          addBlank();
        });
      }
    } else if (i === 1) {
      // Second page: remaining clauses
      if (clauses.length > 8) {
        clauses.slice(8).forEach((clause, idx) => {
          const clauseText = `${idx + 9}. ${clause.title}`;
          addText(clauseText, { bold: true, size: 10 });
          if (clause.body) {
            addText(clause.body, { indent: 15, size: 9 });
          }
          addBlank();
        });
      } else {
        // More detailed clause text
        clauses.forEach((clause, idx) => {
          if (clause.body2) {
            addText(clause.body2, { indent: 15, size: 9 });
            addBlank();
          }
        });
      }
    } else if (i === 2 && schedules.length > 0) {
      // Third page: schedules
      addText('SCHEDULES', { bold: true, size: 14 });
      addBlank();
      schedules.forEach((sched, idx) => {
        addText(`Schedule ${idx + 1}: ${sched.title}`, { bold: true, size: 10 });
        if (sched.body) {
          addText(sched.body, { indent: 15, size: 9 });
        }
        addBlank();
      });
    } else {
      // Additional pages: more content
      addText(`— ${title} —`, { bold: true, size: 12, color: rgb(0.18, 0.19, 0.57) });
      addBlank();
      addText('This page forms part of the above-mentioned agreement.', { size: 9, color: rgb(0.4, 0.4, 0.4) });
      addBlank();
      addText('IN WITNESS WHEREOF, the parties have executed this agreement on the date first above written.', { size: 10 });
      addBlank();
      addBlank();
      addText('SIGNED by the said ________________________', { size: 10 });
      addBlank();
      addText('In the presence of: ________________________', { size: 10 });
      addBlank();
      addText('Name: ____________________________________', { size: 10 });
      addText('ID/Passport: ______________________________', { size: 10 });
      addText('Signature: _______________________________', { size: 10 });
    }
  }

  return doc;
}

// ── Document Definitions ────────────────────────────────────────────

const documents = [
  {
    filename: 'sale-agreement.pdf',
    title: 'SALE AGREEMENT',
    pages: 5,
    options: {
      subtitle: 'For the Sale of Land and Property',
      reference: 'SA/2026/001',
      parties: [
        { name: 'JOHN KAMAU MWANGI', description: 'ID No. 12345678, of P.O. Box 1234-00100, Nairobi (hereinafter "the Vendor")' },
        { name: 'MARY WANJIKU NJOROGE', description: 'ID No. 87654321, of P.O. Box 5678-00200, Nairobi (hereinafter "the Purchaser")' },
      ],
      clauses: [
        { title: 'DEFINITIONS AND INTERPRETATION', body: 'In this Agreement, unless the context otherwise requires: "Property" means all that parcel of land known as LR No. 209/12345 situated in Nairobi County; "Purchase Price" means the sum of KES 12,500,000; "Completion Date" means 45 days from the date of this Agreement.' },
        { title: 'SALE AND PURCHASE', body: 'The Vendor agrees to sell and the Purchaser agrees to purchase the Property on the terms and conditions set out in this Agreement.' },
        { title: 'PURCHASE PRICE', body: 'The Purchase Price for the Property shall be KES 12,500,000 (Twelve Million Five Hundred Thousand Kenya Shillings only) payable as follows: (a) A deposit of 10% (KES 1,250,000) upon execution of this Agreement; (b) The balance of 90% (KES 11,250,000) on or before the Completion Date.' },
        { title: 'DEPOSIT', body: 'The Purchaser shall pay the deposit to the Vendor\'s advocates, to be held as stakeholder pending completion.' },
        { title: 'COMPLETION', body: 'Completion shall take place on the Completion Date at the offices of the Vendor\'s advocates or at such other place as the parties may agree.' },
        { title: 'VACANT POSSESSION', body: 'The Vendor shall give vacant possession of the Property to the Purchaser on the Completion Date.' },
        { title: 'RISK AND INSURANCE', body: 'The Property shall be at the risk of the Vendor until the Completion Date. The Vendor shall maintain adequate insurance cover until completion.' },
        { title: 'REPRESENTATIONS AND WARRANTIES', body: 'The Vendor warrants that: (a) The Vendor has good and marketable title to the Property; (b) There are no encumbrances, charges, or liens affecting the Property; (c) All rates, taxes, and outgoings have been paid up to date.' },
        { title: 'DEFAULT', body: 'If the Purchaser fails to complete on the Completion Date, the Vendor may: (a) Forfeit the deposit; (b) Rescind the Agreement; (c) Sue for specific performance.' },
        { title: 'DISPUTE RESOLUTION', body: 'Any dispute arising out of this Agreement shall first be referred to mediation. If not resolved within 30 days, the dispute shall be referred to arbitration in accordance with the Arbitration Act, Cap 49 Laws of Kenya.' },
        { title: 'GOVERNING LAW', body: 'This Agreement shall be governed by and construed in accordance with the laws of the Republic of Kenya.' },
        { title: 'ENTIRE AGREEMENT', body: 'This Agreement constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, and agreements.' },
      ],
      schedules: [
        { title: 'Description of the Property', body: 'LR No. 209/12345, measuring approximately 0.25 hectares, situated in Nairobi County, registered under the Registration of Titles Act, Cap 281.' },
        { title: 'Payment Schedule', body: 'Deposit: KES 1,250,000 upon execution. Balance: KES 11,250,000 on or before Completion Date.' },
      ],
    },
  },
  {
    filename: 'employment-contract.pdf',
    title: 'EMPLOYMENT CONTRACT',
    pages: 4,
    options: {
      subtitle: 'Permanent and Pensionable Employment',
      reference: 'EC/2026/045',
      parties: [
        { name: 'NYAERA OGEGA & CO. ADVOCATES', description: 'A law firm duly registered in Kenya, of Shelter Afrique Building, Mamlaka Road, Nairobi (hereinafter "the Employer")' },
        { name: 'JANE AKINYI OTIENO', description: 'ID No. 34567890, of P.O. Box 9012-00300, Nairobi (hereinafter "the Employee")' },
      ],
      clauses: [
        { title: 'APPOINTMENT', body: 'The Employer hereby appoints the Employee as an Associate Advocate, and the Employee accepts such appointment, subject to the terms and conditions set out in this Contract.' },
        { title: 'COMMENCEMENT DATE', body: 'This Contract shall commence on 1st August 2026 and shall continue until terminated in accordance with the provisions herein.' },
        { title: 'PROBATION PERIOD', body: 'The Employee shall serve a probation period of six (6) months from the Commencement Date. During this period, either party may terminate the Contract by giving seven (7) days\' notice in writing.' },
        { title: 'DUTIES AND RESPONSIBILITIES', body: 'The Employee shall: (a) Provide legal advice and representation to clients; (b) Prepare legal documents and pleadings; (c) Appear before courts and tribunals; (d) Perform such other duties as may be assigned by the Employer.' },
        { title: 'REMUNERATION', body: 'The Employee shall receive a monthly salary of KES 180,000 (One Hundred and Eighty Thousand Kenya Shillings only) subject to statutory deductions including PAYE, NSSF, and NHIF.' },
        { title: 'WORKING HOURS', body: 'The Employee shall work from 8:00 AM to 5:00 PM, Monday to Friday, with a one-hour lunch break. Additional hours may be required as necessary.' },
        { title: 'ANNUAL LEAVE', body: 'The Employee shall be entitled to 21 working days of annual leave per year, to be taken at times mutually agreed upon.' },
        { title: 'SICK LEAVE', body: 'The Employee shall be entitled to 30 days of sick leave per year with full pay, upon production of a medical certificate.' },
        { title: 'TERMINATION', body: 'Either party may terminate this Contract by giving one (1) month\'s notice in writing, or by payment of one (1) month\'s salary in lieu of notice.' },
        { title: 'CONFIDENTIALITY', body: 'The Employee shall not, during or after employment, disclose any confidential information relating to the Employer\'s business or clients.' },
        { title: 'NON-COMPETE', body: 'For a period of six (6) months after termination, the Employee shall not work for any competing law firm within Nairobi County.' },
        { title: 'CODE OF CONDUCT', body: 'The Employee shall adhere to the Law Society of Kenya Code of Conduct and the Employer\'s internal policies.' },
      ],
      schedules: [
        { title: 'Job Description', body: 'Full job description including practice areas: conveyancing, commercial law, litigation, family law, and legal research.' },
        { title: 'Benefits', body: 'Medical insurance cover of up to KES 500,000 per annum; Group life insurance; Annual performance bonus of up to 2 months\' salary.' },
      ],
    },
  },
  {
    filename: 'company-incorporation.pdf',
    title: 'COMPANY INCORPORATION DOCUMENTS',
    pages: 6,
    options: {
      subtitle: 'Incorporation of a Private Limited Company under the Companies Act, 2015',
      reference: 'CI/2026/089',
      parties: [
        { name: 'TECHNOVA SOLUTIONS LIMITED', description: 'Proposed name of the company to be incorporated under the Companies Act, 2015' },
        { name: 'THE REGISTRAR OF COMPANIES', description: 'Office of the Attorney General, Nairobi' },
      ],
      clauses: [
        { title: 'PROPOSED COMPANY NAME', body: 'The proposed name of the company is TECHNOVA SOLUTIONS LIMITED, subject to availability and approval by the Registrar of Companies.' },
        { title: 'REGISTERED OFFICE', body: 'The registered office of the company shall be situated at P.O. Box 4567-00100, Nairobi, Kenya.' },
        { title: 'OBJECTS OF THE COMPANY', body: 'The company is formed for the following objects: (a) To carry on the business of information technology solutions, software development, and consulting; (b) To import, export, and deal in computer hardware and software; (c) To provide training and education in information technology; (d) To invest in technology startups and ventures.' },
        { title: 'SHARE CAPITAL', body: 'The share capital of the company shall be KES 1,000,000 divided into 10,000 ordinary shares of KES 100 each.' },
        { title: 'DIRECTORS', body: 'The first directors of the company shall be: (a) Peter Mwangi Kimani — Director; (b) Sarah Wambui Kamau — Director; (c) David Ochieng Onyango — Director.' },
        { title: 'COMPANY SECRETARY', body: 'The first company secretary shall be Nyaera Ogega & Co. Advocates, or such other qualified person as the directors may appoint.' },
        { title: 'MEMORANDUM OF ASSOCIATION', body: 'The subscribers to the Memorandum of Association wish to be formed into a company pursuant to this Memorandum and agree to take the shares set out opposite their respective names.' },
        { title: 'ARTICLES OF ASSOCIATION', body: 'The company shall be governed by the Articles of Association as filed with the Registrar, which shall regulate the internal management of the company.' },
        { title: 'REGISTRATION PROCESS', body: 'The company shall be registered upon: (a) Approval of the proposed name; (b) Filing of the Memorandum and Articles of Association; (c) Payment of the prescribed registration fees; (d) Issuance of the Certificate of Incorporation.' },
        { title: 'POST-INCORPORATION', body: 'Upon incorporation, the company shall: (a) Hold the first board meeting; (b) Appoint auditors; (c) Open a bank account; (d) Register for tax compliance.' },
        { title: 'STATUTORY COMPLIANCE', body: 'The company shall comply with all statutory requirements including filing of annual returns, tax returns, and maintaining proper books of account.' },
        { title: 'INDEMNITY', body: 'Every director, officer, or agent of the company shall be indemnified out of the assets of the company against any liability incurred in the execution of their duties.' },
      ],
      schedules: [
        { title: 'Memorandum of Association', body: 'Full text of the Memorandum of Association including the name clause, registered office clause, objects clause, liability clause, and capital clause.' },
        { title: 'Articles of Association', body: 'Full text of the Articles of Association including share capital, directors, meetings, dividends, accounts, and winding up provisions.' },
        { title: 'Statement of Nominal Capital', body: 'Statement of nominal capital and particulars of subscribers.' },
      ],
    },
  },
  {
    filename: 'lease-agreement.pdf',
    title: 'LEASE AGREEMENT',
    pages: 5,
    options: {
      subtitle: 'Commercial Lease for Office Premises',
      reference: 'LS/2026/234',
      parties: [
        { name: 'GREENFIELD PROPERTIES LIMITED', description: 'A company duly incorporated in Kenya, of P.O. Box 7890-00200, Nairobi (hereinafter "the Landlord")' },
        { name: 'AFRICA TRADE CONSULTANTS LIMITED', description: 'A company duly incorporated in Kenya, of P.O. Box 3456-00100, Nairobi (hereinafter "the Tenant")' },
      ],
      clauses: [
        { title: 'DEMISE', body: 'The Landlord hereby demises to the Tenant ALL THAT suite of offices known as Suite 401, 4th Floor, Greenfield Towers, Upper Hill, Nairobi (hereinafter "the Premises").' },
        { title: 'TERM', body: 'The term of this Lease shall be five (5) years commencing on 1st September 2026 and expiring on 31st August 2031.' },
        { title: 'RENT', body: 'The Tenant shall pay a monthly rent of KES 350,000 (Three Hundred and Fifty Thousand Kenya Shillings only) payable in advance on the first day of each month.' },
        { title: 'RENT REVIEW', body: 'The rent shall be reviewed every two (2) years at a rate to be agreed between the parties, or in default of agreement, at the prevailing market rate.' },
        { title: 'SERVICE CHARGE', body: 'The Tenant shall pay a service charge of KES 45,000 per month towards the maintenance of common areas, security, and utilities.' },
        { title: 'DEPOSIT', body: 'The Tenant shall pay a security deposit equivalent to three (3) months\' rent, being KES 1,050,000, to be held by the Landlord as security for the performance of the Tenant\'s obligations.' },
        { title: 'USE OF PREMISES', body: 'The Premises shall be used only for professional office purposes and shall not be used for any illegal, immoral, or offensive trade or business.' },
        { title: 'ALTERATIONS', body: 'The Tenant shall not make any structural alterations or additions to the Premises without the prior written consent of the Landlord.' },
        { title: 'REPAIRS AND MAINTENANCE', body: 'The Tenant shall keep the interior of the Premises in good repair and condition, fair wear and tear excepted.' },
        { title: 'INSURANCE', body: 'The Landlord shall insure the building against fire and other perils. The Tenant shall insure its own contents and shall indemnify the Landlord against any increased premiums.' },
        { title: 'ASSIGNMENT AND SUBLETTING', body: 'The Tenant shall not assign, sublet, or part with possession of the Premises or any part thereof without the Landlord\'s prior written consent.' },
        { title: 'TERMINATION', body: 'Either party may terminate this Lease by giving six (6) months\' notice in writing after the expiry of the third year of the term.' },
      ],
      schedules: [
        { title: 'Floor Plan', body: 'The Premises comprise approximately 150 square meters of office space including a reception area, three offices, a meeting room, and a kitchenette.' },
        { title: 'Inventory of Fixtures and Fittings', body: 'Detailed inventory including air conditioning units, lighting fixtures, carpeting, and window blinds.' },
      ],
    },
  },
  {
    filename: 'mou-template.pdf',
    title: 'MEMORANDUM OF UNDERSTANDING',
    pages: 3,
    options: {
      subtitle: 'Strategic Partnership Agreement',
      reference: 'MOU/2026/012',
      parties: [
        { name: 'EAST AFRICA LEGAL AID FOUNDATION', description: 'A non-profit organization registered in Kenya, of P.O. Box 1111-00100, Nairobi (hereinafter "EALAF")' },
        { name: 'NYAERA OGEGA & CO. ADVOCATES', description: 'A law firm duly registered in Kenya, of Shelter Afrique Building, Mamlaka Road, Nairobi (hereinafter "the Firm")' },
      ],
      clauses: [
        { title: 'PURPOSE', body: 'The purpose of this MOU is to establish a framework of cooperation between the Parties in providing pro bono legal services to indigent persons in Nairobi County.' },
        { title: 'OBJECTIVES', body: 'The objectives of this MOU are: (a) To provide free legal aid to persons who cannot afford legal representation; (b) To conduct community legal awareness programs; (c) To collaborate on legal research and policy advocacy.' },
        { title: 'SCOPE OF COOPERATION', body: 'The Parties agree to cooperate in the following areas: (a) Referral of clients for pro bono representation; (b) Joint legal clinics and outreach programs; (c) Sharing of legal resources and expertise; (d) Capacity building and training.' },
        { title: 'ROLES AND RESPONSIBILITIES', body: 'EALAF shall: identify and screen potential beneficiaries, organize legal clinics, and provide administrative support. The Firm shall: provide pro bono legal representation, assign qualified advocates, and maintain client confidentiality.' },
        { title: 'RESOURCE COMMITMENT', body: 'Each Party shall bear its own costs and expenses incurred in the implementation of this MOU, unless otherwise agreed in writing.' },
        { title: 'DURATION', body: 'This MOU shall take effect from the date of signing and shall remain in force for a period of two (2) years, renewable by mutual agreement.' },
        { title: 'CONFIDENTIALITY', body: 'The Parties shall maintain the confidentiality of all information shared in the course of implementing this MOU.' },
        { title: 'DISPUTE RESOLUTION', body: 'Any dispute arising from this MOU shall be resolved through amicable negotiations between the Parties.' },
        { title: 'AMENDMENT', body: 'This MOU may be amended by mutual written agreement of the Parties.' },
        { title: 'TERMINATION', body: 'Either Party may terminate this MOU by giving thirty (30) days\' notice in writing.' },
      ],
      schedules: [
        { title: 'Areas of Operation', body: 'Initial operations shall be in Nairobi County, with potential expansion to Kiambu, Machakos, and Kajiado Counties.' },
      ],
    },
  },
  {
    filename: 'power-of-attorney.pdf',
    title: 'POWER OF ATTORNEY',
    pages: 4,
    options: {
      subtitle: 'General Power of Attorney',
      reference: 'PA/2026/078',
      parties: [
        { name: 'GRACE NYAMBURA KARIUKI', description: 'ID No. 56789012, of P.O. Box 2222-00200, Nairobi (hereinafter "the Donor")' },
        { name: 'MICHAEL KARIUKI NJOROGE', description: 'ID No. 90123456, of P.O. Box 3333-00100, Nairobi (hereinafter "the Attorney")' },
      ],
      clauses: [
        { title: 'APPOINTMENT', body: 'The Donor hereby appoints the Attorney to be the lawful attorney of the Donor for the purposes set out in this Power of Attorney.' },
        { title: 'AUTHORITY GRANTED', body: 'The Attorney is authorized to: (a) Manage and administer all properties and assets of the Donor; (b) Collect rents, profits, and income from the Donor\'s properties; (c) Pay all taxes, rates, and outgoings; (d) Enter into contracts and agreements on behalf of the Donor.' },
        { title: 'BANKING POWERS', body: 'The Attorney may operate the Donor\'s bank accounts, including but not limited to: (a) Withdrawing and depositing funds; (b) Signing cheques and other banking instruments; (c) Applying for loans and overdrafts.' },
        { title: 'PROPERTY MANAGEMENT', body: 'The Attorney may: (a) Lease, let, or manage the Donor\'s properties; (b) Carry out repairs and maintenance; (c) Purchase or sell properties on behalf of the Donor.' },
        { title: 'LEGAL PROCEEDINGS', body: 'The Attorney may: (a) Instruct advocates and legal counsel; (b) Appear in court proceedings on behalf of the Donor; (c) Settle or compromise claims.' },
        { title: 'DURATION', body: 'This Power of Attorney shall remain in force until: (a) Revoked by the Donor in writing; (b) The death of the Donor; (c) The Donor becomes mentally incapacitated.' },
        { title: 'INDEMNITY', body: 'The Donor agrees to indemnify the Attorney against all claims, losses, and expenses arising from the proper exercise of the powers granted herein.' },
        { title: 'GOVERNING LAW', body: 'This Power of Attorney shall be governed by the laws of the Republic of Kenya.' },
      ],
      schedules: [
        { title: 'List of Properties', body: '1. LR No. 209/6789 — Residential house in Lavington, Nairobi. 2. LR No. 1234/56 — Commercial plot in Mombasa Road. 3. Motor Vehicle KCA 123T — Toyota Prado.' },
        { title: 'Bank Accounts', body: '1. Equity Bank — Account No. 1234567890. 2. KCB Bank — Account No. 0987654321.' },
      ],
    },
  },
  {
    filename: 'tenancy-notice.pdf',
    title: 'TENANCY NOTICE',
    pages: 3,
    options: {
      subtitle: 'Notice to Terminate Tenancy under the Landlord and Tenant (Shops, Hotels and Catering Establishments) Act, Cap 301',
      reference: 'TN/2026/156',
      parties: [
        { name: 'SUNRISE INVESTMENTS LIMITED', description: 'The Landlord, of P.O. Box 4444-00100, Nairobi' },
        { name: 'KIBERA RETAIL STORES', description: 'The Tenant, of P.O. Box 5555-00200, Nairobi' },
      ],
      clauses: [
        { title: 'PARTIES', body: 'This Notice is given by the Landlord to the Tenant in respect of the premises known as Shop No. 12, Sunrise Plaza, Ngong Road, Nairobi (hereinafter "the Premises").' },
        { title: 'TENANCY DETAILS', body: 'The Tenant holds a monthly tenancy of the Premises at a monthly rent of KES 120,000, which tenancy commenced on 1st January 2024.' },
        { title: 'GROUNDS FOR TERMINATION', body: 'The Landlord hereby gives notice of termination of the tenancy on the following grounds: (a) The Tenant has persistently defaulted in payment of rent; (b) The Tenant has breached the terms of the tenancy by subletting without consent; (c) The Landlord intends to carry out substantial renovations to the building.' },
        { title: 'NOTICE PERIOD', body: 'The Tenant is hereby given two (2) months\' notice of termination of the tenancy, effective from the date of this notice.' },
        { title: 'VACANT POSSESSION', body: 'The Tenant is required to deliver vacant possession of the Premises on or before the expiry of the notice period.' },
        { title: 'RENT ARREARS', body: 'As at the date of this notice, the Tenant owes KES 360,000 in rent arrears. The Tenant is required to clear all arrears before vacating.' },
        { title: 'RIGHT OF REFERENCE', body: 'The Tenant may refer this notice to the Business Premises Rent Tribunal within thirty (30) days of receipt, in accordance with Section 6 of the Act.' },
        { title: 'EFFECT OF NON-COMPLIANCE', body: 'If the Tenant fails to vacate or refer this notice to the Tribunal within the prescribed period, the Landlord may apply to the Tribunal for an order of eviction.' },
      ],
      schedules: [
        { title: 'Statement of Rent Arrears', body: 'Rent arrears as at date of notice: March 2026: KES 120,000 (unpaid); April 2026: KES 120,000 (unpaid); May 2026: KES 120,000 (unpaid). Total: KES 360,000.' },
      ],
    },
  },
  {
    filename: 'divorce-petition.pdf',
    title: 'DIVORCE PETITION',
    pages: 5,
    options: {
      subtitle: 'Petition for Dissolution of Marriage under the Marriage Act, 2014',
      reference: 'DP/2026/045',
      parties: [
        { name: 'ROBERT OCHIENG ODHIAMBO', description: 'ID No. 78901234, of P.O. Box 6666-00100, Nairobi (hereinafter "the Petitioner")' },
        { name: 'DIANA ACHIENG ODHIAMBO', description: 'ID No. 43210987, of P.O. Box 7777-00200, Nairobi (hereinafter "the Respondent")' },
      ],
      clauses: [
        { title: 'INTRODUCTION', body: 'The Petitioner hereby petitions this Honourable Court for the dissolution of his marriage to the Respondent on the ground that the marriage has irretrievably broken down.' },
        { title: 'PARTICULARS OF MARRIAGE', body: 'The Petitioner and the Respondent were lawfully married on 15th June 2018 at the Registrar of Marriages, Nairobi, under the Marriage Act, 2014.' },
        { title: 'RESIDENCE', body: 'Both parties are domiciled in Kenya and ordinarily resident in Nairobi County.' },
        { title: 'CHILDREN OF THE MARRIAGE', body: 'There are two (2) children of the marriage: (a) Brian Omondi Odhiambo, born 12th March 2019; (b) Amanda Akinyi Odhiambo, born 5th September 2021.' },
        { title: 'GROUNDS FOR DIVORCE', body: 'The marriage has irretrievably broken down by reason of: (a) Adultery by the Respondent; (b) Cruelty and emotional abuse; (c) Desertion for a continuous period of at least two (2) years.' },
        { title: 'CUSTODY', body: 'The Petitioner prays for joint custody of the children of the marriage, with the primary care and control to be granted to the Petitioner.' },
        { title: 'MAINTENANCE', body: 'The Petitioner prays for an order that the Respondent pays monthly maintenance for the children in the sum of KES 50,000 per month.' },
        { title: 'MATRIMONIAL PROPERTY', body: 'The Petitioner prays for: (a) A declaration of the matrimonial property; (b) An order for equitable distribution of the matrimonial property; (c) An order that the matrimonial home be transferred to the Petitioner.' },
        { title: 'COSTS', body: 'The Petitioner prays for costs of this petition.' },
        { title: 'PRAYER', body: 'WHEREFORE the Petitioner prays for: (a) Dissolution of the marriage; (b) Joint custody of the children; (c) Maintenance for the children; (d) Distribution of matrimonial property; (e) Costs of the petition.' },
      ],
      schedules: [
        { title: 'Affidavit in Support', body: 'The Petitioner swears an affidavit verifying the facts set out in this petition and confirming that all information provided is true and correct to the best of the Petitioner\'s knowledge.' },
      ],
    },
  },
  {
    filename: 'civil-litigation-templates.pdf',
    title: 'CIVIL LITIGATION TEMPLATES',
    pages: 6,
    options: {
      subtitle: 'Comprehensive Civil Litigation Forms and Precedents',
      reference: 'CLT/2026/001',
      parties: [
        { name: 'NYAERA OGEGA & CO. ADVOCATES', description: 'Compilation of civil litigation templates for use in Kenyan courts' },
        { name: 'THE REPUBLIC OF KENYA', description: 'Jurisdiction of the High Court of Kenya and subordinate courts' },
      ],
      clauses: [
        { title: 'PLAINT', body: 'FORM 2A — PLAINT (Order 4, Rule 1): IN THE HIGH COURT OF KENYA AT NAIROBI. CIVIL SUIT NO. ______ OF 2026. BETWEEN: [PLAINTIFF] — AND — [DEFENDANT]. The Plaintiff\'s claim against the Defendant is for: (a) KES [amount] being money due and payable; (b) Interest at court rates; (c) Costs of this suit.' },
        { title: 'DEFENCE', body: 'FORM 2B — DEFENCE (Order 2, Rule 6): The Defendant: (a) Admits paragraph [x] of the Plaint; (b) Denies paragraph [y] of the Plaint; (c) Does not admit paragraph [z] of the Plaint and puts the Plaintiff to strict proof thereof.' },
        { title: 'COUNTERCLAIM', body: 'FORM 2C — COUNTERCLAIM (Order 7, Rule 3): The Defendant further claims against the Plaintiff: (a) KES [amount] being damages for breach of contract; (b) Interest at court rates; (c) Costs of the counterclaim.' },
        { title: 'REPLY TO DEFENCE', body: 'FORM 2D — REPLY TO DEFENCE (Order 7, Rule 10): The Plaintiff joins issue with the Defendant on the Defence and puts the Defendant to strict proof of all allegations contained therein.' },
        { title: 'LIST OF WITNESSES', body: 'FORM 3A — LIST OF WITNESSES (Order 3, Rule 2): The Plaintiff/Defendant intends to call the following witnesses: 1. [Name], [ID No.], [Address]; 2. [Name], [ID No.], [Address].' },
        { title: 'LIST OF DOCUMENTS', body: 'FORM 3B — LIST OF DOCUMENTS (Order 3, Rule 2): The Plaintiff/Defendant intends to rely on the following documents: 1. [Description of document]; 2. [Description of document].' },
        { title: 'SUMMONS TO ENTER APPEARANCE', body: 'FORM 4 — SUMMONS TO ENTER APPEARANCE (Order 5, Rule 1): To: [Defendant]. You are required within fifteen (15) days after service of this summons to enter an appearance in the above suit.' },
        { title: 'NOTICE OF MOTION', body: 'FORM 5 — NOTICE OF MOTION (Order 51, Rule 1): TAKE NOTICE that this Honourable Court will be moved on [date] at [time] for orders: (a) That [specific order sought]; (b) That costs be provided for.' },
        { title: 'SUPPORTING AFFIDAVIT', body: 'FORM 6 — SUPPORTING AFFIDAVIT (Order 19, Rule 1): I, [Name], of [Address], make oath and state as follows: 1. That I am the [Applicant/Respondent] herein. 2. That the facts deponed to herein are within my personal knowledge and are true and correct.' },
        { title: 'CERTIFICATE OF URGENCY', body: 'FORM 7 — CERTIFICATE OF URGENCY (Practice Direction): I certify that this matter is urgent for the following reasons: [state reasons]. The same cannot await the normal hearing date.' },
        { title: 'DRAFT ORDER', body: 'FORM 8 — DRAFT ORDER (Order 21, Rule 8): UPON READING the application dated [date] and the affidavit of [name] sworn on [date]; IT IS HEREBY ORDERED: 1. That [order]. 2. That costs be [borne by/paid to].' },
        { title: 'BILL OF COSTS', body: 'FORM 9 — BILL OF COSTS (Schedule 6, Advocates Remuneration Order): IN THE [COURT] AT [VENUE]. BILL OF COSTS BETWEEN [PARTIES]. Instructions fee: KES [amount]. Getting up fee: KES [amount]. Attendances: KES [amount]. Total: KES [amount].' },
      ],
      schedules: [
        { title: 'Practice Directions', body: 'All templates comply with the Civil Procedure Rules, 2010 (Legal Notice No. 151 of 2010) and the Practice Directions issued by the Chief Justice.' },
        { title: 'Filing Fees', body: 'Current court filing fees as per the Judicature Act (Cap 8) and the Court Fees (Amendment) Order, 2022.' },
        { title: 'Limitation Periods', body: 'Reference table of limitation periods under the Limitation of Actions Act, Cap 22 Laws of Kenya.' },
      ],
    },
  },
];

// ── Main Generation Function ────────────────────────────────────────
async function main() {
  console.log('📄 Generating sample legal document PDFs...\n');

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  for (const doc of documents) {
    const filePath = path.join(OUTPUT_DIR, doc.filename);
    console.log(`  Creating: ${doc.filename} (${doc.pages} pages)...`);

    try {
      const pdfDoc = await createDocument(doc.title, doc.pages, doc.options);
      const pdfBytes = await pdfDoc.save();
      fs.writeFileSync(filePath, pdfBytes);
      const sizeKB = (pdfBytes.length / 1024).toFixed(1);
      console.log(`  ✅ Saved: ${doc.filename} (${sizeKB} KB)`);
    } catch (err) {
      console.error(`  ❌ Failed: ${doc.filename}`, err.message);
    }
  }

  console.log('\n✨ All sample PDFs generated successfully!');
  console.log(`   Output directory: ${OUTPUT_DIR}`);
}

main().catch(console.error);
