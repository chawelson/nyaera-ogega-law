#!/usr/bin/env python3
"""
Nyaera Ogega & Co. Advocates - Website Instruction Manual PDF Generator
Run: python generate_manual_pdf.py

Generates a professional PDF instruction manual for Sharon with the firm's
brand colors (navy #090d3f, gold #ab812b) and all operational details.
"""

import os
import sys
import subprocess
from datetime import datetime

# ── Ensure reportlab is installed ────────────────────────────────────
try:
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.units import cm
    from reportlab.lib.colors import HexColor, white, black
    from reportlab.platypus import (
        SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
        PageBreak, Image, KeepTogether
    )
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY, TA_RIGHT
except ImportError:
    print("📦 Installing required package: reportlab...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "reportlab"])
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.units import cm
    from reportlab.lib.colors import HexColor, white, black
    from reportlab.platypus import (
        SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
        PageBreak, Image, KeepTogether
    )
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY, TA_RIGHT

# ═══════════════════════════════════════════════════════════════════════
# COLOR SCHEME — matches the website
# ═══════════════════════════════════════════════════════════════════════
NAVY        = HexColor('#090d3f')
GOLD        = HexColor('#ab812b')
LIGHT_GOLD  = HexColor('#f0c675')
MID_NAVY    = HexColor('#2e3192')
WHITE       = white
BLACK       = black
LIGHT_BG    = HexColor('#f6f7ff')
DARK_TEXT    = HexColor('#333333')
GRAY_TEXT    = HexColor('#666666')
AMBER_BG    = HexColor('#fef3c7')
AMBER_BORDER = HexColor('#f59e0b')

OUTPUT_FILE = "Nyaera_Ogega_Website_Manual.pdf"

# ═══════════════════════════════════════════════════════════════════════
# STYLES
# ═══════════════════════════════════════════════════════════════════════
def build_styles():
    """Return a dictionary of all ParagraphStyles used in the manual."""
    s = getSampleStyleSheet()

    s.add(ParagraphStyle(
        'CoverTitle', parent=s['Title'],
        fontName='Helvetica-Bold', fontSize=28, leading=34,
        textColor=WHITE, alignment=TA_CENTER, spaceAfter=6,
    ))
    s.add(ParagraphStyle(
        'CoverSubtitle', parent=s['Normal'],
        fontName='Helvetica-Bold', fontSize=20, leading=26,
        textColor=GOLD, alignment=TA_CENTER, spaceAfter=12,
    ))
    s.add(ParagraphStyle(
        'CoverTagline', parent=s['Normal'],
        fontName='Helvetica', fontSize=12, leading=16,
        textColor=WHITE, alignment=TA_CENTER, spaceAfter=6,
    ))
    s.add(ParagraphStyle(
        'CoverFooter', parent=s['Normal'],
        fontName='Helvetica', fontSize=8, leading=10,
        textColor=LIGHT_GOLD, alignment=TA_CENTER,
    ))
    s.add(ParagraphStyle(
        'SectionH1', parent=s['Heading1'],
        fontName='Helvetica-Bold', fontSize=18, leading=22,
        textColor=NAVY, spaceAfter=10, spaceBefore=16,
    ))
    s.add(ParagraphStyle(
        'SectionH2', parent=s['Heading2'],
        fontName='Helvetica-Bold', fontSize=14, leading=18,
        textColor=MID_NAVY, spaceAfter=6, spaceBefore=10,
    ))
    s.add(ParagraphStyle(
        'SectionH3', parent=s['Heading3'],
        fontName='Helvetica-Bold', fontSize=12, leading=15,
        textColor=NAVY, spaceAfter=4, spaceBefore=8,
    ))
    s.add(ParagraphStyle(
        'Body', parent=s['Normal'],
        fontName='Helvetica', fontSize=10, leading=14,
        textColor=DARK_TEXT, spaceAfter=4, alignment=TA_LEFT,
    ))
    s.add(ParagraphStyle(
        'BodyBold', parent=s['Normal'],
        fontName='Helvetica-Bold', fontSize=10, leading=14,
        textColor=DARK_TEXT, spaceAfter=4,
    ))
    s.add(ParagraphStyle(
        'MyBullet', parent=s['Normal'],
        fontName='Helvetica', fontSize=10, leading=13,
        textColor=DARK_TEXT, spaceAfter=3,
        leftIndent=18, bulletIndent=0,
    ))
    s.add(ParagraphStyle(
        'MyBulletBold', parent=s['Normal'],
        fontName='Helvetica-Bold', fontSize=10, leading=13,
        textColor=DARK_TEXT, spaceAfter=3,
        leftIndent=18, bulletIndent=0,
    ))
    s.add(ParagraphStyle(
        'MyStep', parent=s['Normal'],
        fontName='Helvetica', fontSize=10, leading=14,
        textColor=DARK_TEXT, spaceAfter=4,
        leftIndent=12,
    ))
    s.add(ParagraphStyle(
        'MyInfoBox', parent=s['Normal'],
        fontName='Helvetica', fontSize=10, leading=14,
        textColor=WHITE, spaceAfter=8, spaceBefore=8,
        leftIndent=12, rightIndent=12,
    ))
    s.add(ParagraphStyle(
        'MyWarningBox', parent=s['Normal'],
        fontName='Helvetica', fontSize=10, leading=14,
        textColor=NAVY, spaceAfter=8, spaceBefore=8,
        leftIndent=12, rightIndent=12,
    ))
    s.add(ParagraphStyle(
        'MyCode', parent=s['Code'],
        fontName='Courier', fontSize=9, leading=12,
        textColor=DARK_TEXT, spaceAfter=4,
        leftIndent=12,
    ))
    s.add(ParagraphStyle(
        'MyTOCItem', parent=s['Normal'],
        fontName='Helvetica', fontSize=11, leading=18,
        textColor=DARK_TEXT, spaceAfter=2,
        leftIndent=0,
    ))
    s.add(ParagraphStyle(
        'MyFooter', parent=s['Normal'],
        fontName='Helvetica', fontSize=7, leading=9,
        textColor=GRAY_TEXT, alignment=TA_CENTER,
    ))
    return s


# ═══════════════════════════════════════════════════════════════════════
# HELPERS
# ═══════════════════════════════════════════════════════════════════════
def bullet(text, styles):
    return Paragraph(f'• {text}', styles['MyBullet'])

def bullet_bold(text, styles):
    return Paragraph(f'• <b>{text}</b>', styles['MyBulletBold'])

def step(num, text, styles):
    return Paragraph(f'<b>Step {num}:</b>  {text}', styles['MyStep'])

def info_box(text, styles):
    """Navy-background info callout."""
    return Paragraph(text, styles['MyInfoBox'])

def warning_box(text, styles):
    """Amber-background warning callout."""
    return Paragraph(text, styles['MyWarningBox'])

def h1(text, styles):
    return Paragraph(text, styles['SectionH1'])

def h2(text, styles):
    return Paragraph(text, styles['SectionH2'])

def h3(text, styles):
    return Paragraph(text, styles['SectionH3'])

def body(text, styles):
    return Paragraph(text, styles['Body'])

def body_bold(text, styles):
    return Paragraph(text, styles['BodyBold'])

def spacer(h=0.3):
    return Spacer(1, h * cm)

# ═══════════════════════════════════════════════════════════════════════
# COVER PAGE
# ═══════════════════════════════════════════════════════════════════════
def draw_cover(canvas, doc):
    """Draw the cover page (full-bleed navy with gold accents)."""
    w, h = A4
    canvas.saveState()

    # Full navy background
    canvas.setFillColor(NAVY)
    canvas.rect(0, 0, w, h, fill=1, stroke=0)

    # Gold top bar
    canvas.setFillColor(GOLD)
    canvas.rect(0, h - 0.4*cm, w, 0.4*cm, fill=1, stroke=0)

    # Gold bottom bar
    canvas.rect(0, 0.4*cm, w, 0.4*cm, fill=1, stroke=0)

    # Decorative thin gold lines
    canvas.setStrokeColor(GOLD)
    canvas.setLineWidth(0.5)
    canvas.line(2*cm, h - 2.5*cm, w - 2*cm, h - 2.5*cm)
    canvas.line(2*cm, 2.5*cm, w - 2*cm, 2.5*cm)

    # Firm name
    canvas.setFillColor(WHITE)
    canvas.setFont('Helvetica-Bold', 30)
    canvas.drawCentredString(w / 2, h - 5.5*cm, "NYAERA OGEGA")
    canvas.drawCentredString(w / 2, h - 7.0*cm, "& CO. ADVOCATES")

    # Gold accent line under name
    canvas.setStrokeColor(GOLD)
    canvas.setLineWidth(1.5)
    canvas.line(5*cm, h - 8.0*cm, w - 5*cm, h - 8.0*cm)

    # Title
    canvas.setFillColor(GOLD)
    canvas.setFont('Helvetica-Bold', 22)
    canvas.drawCentredString(w / 2, h - 9.5*cm, "WEBSITE INSTRUCTION MANUAL")

    # Tagline
    canvas.setFillColor(WHITE)
    canvas.setFont('Helvetica', 12)
    canvas.drawCentredString(w / 2, h - 11.0*cm,
        "Your Complete Guide to Managing Your Law Firm Website")

    # Version / date
    canvas.setFillColor(LIGHT_GOLD)
    canvas.setFont('Helvetica', 10)
    today = datetime.now().strftime('%B %d, %Y')
    canvas.drawCentredString(w / 2, 3.0*cm, f"Version 1.0  |  {today}")

    # Bottom footer
    canvas.setFillColor(GOLD)
    canvas.setFont('Helvetica', 8)
    canvas.drawCentredString(w / 2, 1.2*cm,
        "© 2026 Nyaera Ogega & Co. Advocates. All Rights Reserved.")
    canvas.drawCentredString(w / 2, 0.7*cm,
        "Shelter Afrique Building, Mamlaka Road, 3rd Floor, Room 4, Nairobi")

    canvas.restoreState()


# ═══════════════════════════════════════════════════════════════════════
# PAGE NUMBER FOOTER (for pages after cover)
# ═══════════════════════════════════════════════════════════════════════
def draw_footer(canvas, doc):
    """Draw page number and footer line on every page except cover."""
    canvas.saveState()
    w, h = A4

    # Thin gold line above footer
    canvas.setStrokeColor(GOLD)
    canvas.setLineWidth(0.5)
    canvas.line(1.5*cm, 1.2*cm, w - 1.5*cm, 1.2*cm)

    # Page number
    canvas.setFillColor(GRAY_TEXT)
    canvas.setFont('Helvetica', 8)
    canvas.drawCentredString(w / 2, 0.6*cm,
        f"Page {doc.page}  |  Nyaera Ogega & Co. Advocates — Instruction Manual")

    canvas.restoreState()


# ═══════════════════════════════════════════════════════════════════════
# BUILD CONTENT
# ═══════════════════════════════════════════════════════════════════════
def build_content(styles):
    """Return the list of flowables for the manual body."""
    story = []

    # ── Start with a PageBreak so the cover (drawn via onFirstPage) is
    #    the only thing on page 1, and the TOC begins on page 2. ──────
    story.append(PageBreak())

    # ──────────────────────────────────────────────────────────────────
    # TABLE OF CONTENTS
    # ──────────────────────────────────────────────────────────────────
    story.append(h1("TABLE OF CONTENTS", styles))
    story.append(spacer(0.4))

    toc = [
        "1.  Website Overview",
        "2.  Using the Public Website",
        "3.  Admin Panel Guide (Order Management)",
        "4.  Setting Up Email on Outlook (Desktop)",
        "5.  Setting Up Email on Mobile (iOS / Android)",
        "6.  Resend Email Platform Guide",
        "7.  How to Register a Paybill or Till Number",
        "8.  Quick Reference & Credentials",
    ]
    for entry in toc:
        story.append(Paragraph(entry, styles['MyTOCItem']))

    story.append(PageBreak())

    # ══════════════════════════════════════════════════════════════════
    # 1. WEBSITE OVERVIEW
    # ══════════════════════════════════════════════════════════════════
    story.append(h1("1. WEBSITE OVERVIEW", styles))
    story.append(spacer(0.2))

    story.append(body_bold("Live Website URL:", styles))
    story.append(info_box(
        '<font color="#f0c675"><b>https://www.nyaeraogegaadvocates.com</b></font>',
        styles
    ))
    story.append(spacer(0.3))

    story.append(h2("What the Website Does", styles))
    story.append(bullet(
        "<b>Homepage</b> — Showcases the firm's services, practice areas, "
        "attorney profiles, and the Document Marketplace.", styles))
    story.append(bullet(
        "<b>Document Marketplace</b> — Clients can browse 146+ legal "
        "documents, preview them, and pay via M-Pesa for instant download.", styles))
    story.append(bullet(
        "<b>Contact Page</b> — Clients can send inquiries directly to the "
        "firm via a contact form.", styles))
    story.append(bullet(
        "<b>Admin Panel</b> — You manage incoming orders, upload drafted "
        "documents, and track client requests.", styles))
    story.append(bullet(
        "<b>My Purchases</b> — Clients can view their purchase history and "
        "download completed documents.", styles))

    story.append(spacer(0.3))
    story.append(h2("Technology Stack", styles))
    story.append(bullet("Frontend: Next.js (React) with Tailwind CSS", styles))
    story.append(bullet("Backend: Next.js API Routes", styles))
    story.append(bullet("Database: PostgreSQL (hosted on Railway)", styles))
    story.append(bullet("File Storage: Supabase Storage (for draft documents)", styles))
    story.append(bullet("Email: Resend (transactional emails)", styles))
    story.append(bullet("Payments: M-Pesa STK Push (Daraja API)", styles))
    story.append(bullet("Hosting: Vercel (production)", styles))
    story.append(bullet("Domain: Truehost (DNS management)", styles))

    story.append(spacer(0.3))
    story.append(h2("Important Links", styles))
    story.append(bullet("Live Website: https://www.nyaeraogegaadvocates.com", styles))
    story.append(bullet("Document Marketplace: https://www.nyaeraogegaadvocates.com/documents", styles))
    story.append(bullet("Admin Panel: https://www.nyaeraogegaadvocates.com/admin/orders", styles))
    story.append(bullet("My Purchases (Client View): https://www.nyaeraogegaadvocates.com/my-purchases", styles))

    story.append(PageBreak())

    # ══════════════════════════════════════════════════════════════════
    # 2. USING THE PUBLIC WEBSITE
    # ══════════════════════════════════════════════════════════════════
    story.append(h1("2. USING THE PUBLIC WEBSITE", styles))
    story.append(spacer(0.2))

    story.append(h2("Browsing the Document Marketplace", styles))
    story.append(bullet("Go to https://www.nyaeraogegaadvocates.com/documents", styles))
    story.append(bullet("Browse by category or use the search bar to find a specific document", styles))
    story.append(bullet("Click on any document to view its full description and preview", styles))
    story.append(bullet("The preview shows a sample with a 'SAMPLE — PREVIEW ONLY' watermark", styles))

    story.append(spacer(0.3))
    story.append(h2("Purchasing a Document", styles))
    story.append(step(1, "Click <b>Add to Cart</b> on the document page", styles))
    story.append(step(2, "Open the cart (top-right icon) and click <b>Proceed to Checkout</b>", styles))
    story.append(step(3, "Enter your <b>name</b>, <b>email</b>, and <b>phone number</b> (2547XXXXXXXX format)", styles))
    story.append(step(4, "Optionally add <b>client instructions</b> for custom drafting", styles))
    story.append(step(5, "Select a <b>priority level</b> (Standard / Urgent / Express)", styles))
    story.append(step(6, "Click <b>Pay with M-Pesa</b> — an STK push is sent to the phone", styles))
    story.append(step(7, "Enter your M-Pesa PIN to complete payment", styles))
    story.append(step(8, "You will receive a <b>receipt email</b> with a download link", styles))

    story.append(spacer(0.3))
    story.append(h2("Downloading a Purchased Document", styles))
    story.append(bullet("Click the download link in the receipt email", styles))
    story.append(bullet("You must accept the <b>License Agreement</b> before downloading", styles))
    story.append(bullet("The PDF is watermarked with your name, email, and transaction ID", styles))
    story.append(bullet("Each download link is valid for <b>48 hours</b> and can be used up to <b>3 times</b>", styles))

    story.append(PageBreak())

    # ══════════════════════════════════════════════════════════════════
    # 3. ADMIN PANEL GUIDE
    # ══════════════════════════════════════════════════════════════════
    story.append(h1("3. ADMIN PANEL GUIDE (ORDER MANAGEMENT)", styles))
    story.append(spacer(0.2))

    story.append(body_bold("Admin Panel URL:", styles))
    story.append(info_box(
        '<font color="#f0c675"><b>https://www.nyaeraogegaadvocates.com/admin/orders</b></font>',
        styles
    ))
    story.append(spacer(0.2))

    story.append(warning_box(
        '<b>⚠️  IMPORTANT:</b> Only share the admin password with trusted team members. '
        'Do not share it publicly or include it in any client communications.',
        styles
    ))
    story.append(spacer(0.3))

    story.append(h2("Logging In", styles))
    story.append(step(1, "Navigate to the Admin Panel URL above", styles))
    story.append(step(2, "Enter the admin password: <b>SNO2026Markt1!#</b>", styles))
    story.append(step(3, "Click <b>Access Admin Panel</b>", styles))

    story.append(spacer(0.3))
    story.append(h2("Admin Panel Features", styles))
    story.append(bullet_bold("View All Orders:", styles))
    story.append(bullet("See all client orders in a single list, sorted by date", styles))
    story.append(bullet("Each order shows: document title, client name, email, phone, amount, and status", styles))

    story.append(spacer(0.2))
    story.append(bullet_bold("Search & Filter:", styles))
    story.append(bullet("Search by document title, client email, phone number, or order ID", styles))
    story.append(bullet("Filter by status: <b>All</b>, <b>Pending</b>, <b>Drafting</b>, or <b>Completed</b>", styles))

    story.append(spacer(0.2))
    story.append(bullet_bold("Order Details:", styles))
    story.append(bullet("Click any order to expand it and view full details", styles))
    story.append(bullet("See <b>Client Instructions</b> — any special requests from the buyer", styles))
    story.append(bullet("View <b>Draft Document</b> status — whether a PDF has been uploaded", styles))
    story.append(bullet("Check <b>Order Meta</b> — date, category, token usage, etc.", styles))

    story.append(spacer(0.2))
    story.append(bullet_bold("Uploading a Draft Document:", styles))
    story.append(step(1, "Click the order to expand it", styles))
    story.append(step(2, "Click <b>Upload Draft</b> button", styles))
    story.append(step(3, "Select the PDF file from your computer", styles))
    story.append(step(4, "Click <b>Upload to Supabase Storage</b>", styles))
    story.append(step(5, "The order status automatically changes to <b>Completed</b>", styles))
    story.append(step(6, "The client can now download the document from their email link", styles))

    story.append(spacer(0.3))
    story.append(h2("Order Statuses Explained", styles))
    story.append(bullet_bold("Pending:", styles))
    story.append(bullet("Payment received, awaiting document drafting", styles))
    story.append(spacer(0.1))
    story.append(bullet_bold("Drafting:", styles))
    story.append(bullet("Document is being drafted by the legal team", styles))
    story.append(spacer(0.1))
    story.append(bullet_bold("Completed:", styles))
    story.append(bullet("Document has been uploaded and is ready for client download", styles))

    story.append(PageBreak())

    # ══════════════════════════════════════════════════════════════════
    # 4. SETTING UP EMAIL ON OUTLOOK
    # ══════════════════════════════════════════════════════════════════
    story.append(h1("4. SETTING UP EMAIL ON OUTLOOK (DESKTOP)", styles))
    story.append(spacer(0.2))

    story.append(h2("Email Credentials", styles))
    story.append(info_box(
        'Email Address: <b>info@nyaeraogegaadvocates.com</b><br/>'
        'Password: <b>ah-1YM?2n%Mh</b>',
        styles
    ))
    story.append(spacer(0.3))

    story.append(h2("Quick Setup (Recommended)", styles))
    story.append(step(1, "Open <b>Outlook</b> on your computer", styles))
    story.append(step(2, "Click <b>File</b> → <b>Add Account</b>", styles))
    story.append(step(3, "Enter email: <b>info@nyaeraogegaadvocates.com</b>", styles))
    story.append(step(4, "Click <b>Connect</b>", styles))
    story.append(step(5, "Enter password: <b>ah-1YM?2n%Mh</b>", styles))
    story.append(step(6, "Click <b>Connect</b> — Outlook will auto-configure", styles))

    story.append(spacer(0.3))
    story.append(h2("Manual Server Settings (if auto-setup fails)", styles))

    story.append(h3("Incoming Mail Server (IMAP)", styles))
    story.append(bullet("Server: <b>mail.truehost.cloud</b>", styles))
    story.append(bullet("Port: <b>993</b>", styles))
    story.append(bullet("Encryption: <b>SSL/TLS</b>", styles))

    story.append(spacer(0.2))
    story.append(h3("Outgoing Mail Server (SMTP)", styles))
    story.append(bullet("Server: <b>mail.truehost.cloud</b>", styles))
    story.append(bullet("Port: <b>465</b>", styles))
    story.append(bullet("Encryption: <b>SSL/TLS</b>", styles))
    story.append(bullet("Authentication: <b>Password Required</b> (same as incoming)", styles))

    story.append(spacer(0.3))
    story.append(h2("Accessing Webmail (Browser)", styles))
    story.append(bullet("URL: <b>https://workplace.truehost.cloud/appsuite</b>", styles))
    story.append(bullet("Login with: <b>info@nyaeraogegaadvocates.com</b>", styles))
    story.append(bullet("Password: <b>ah-1YM?2n%Mh</b>", styles))

    story.append(PageBreak())

    # ══════════════════════════════════════════════════════════════════
    # 5. SETTING UP EMAIL ON MOBILE
    # ══════════════════════════════════════════════════════════════════
    story.append(h1("5. SETTING UP EMAIL ON MOBILE (iOS / ANDROID)", styles))
    story.append(spacer(0.2))

    story.append(h2("iPhone / iPad (iOS Mail App)", styles))
    story.append(step(1, "Open <b>Settings</b> → <b>Mail</b> → <b>Accounts</b> → <b>Add Account</b>", styles))
    story.append(step(2, "Select <b>Other</b> → <b>Add Mail Account</b>", styles))
    story.append(step(3, "Enter:", styles))
    story.append(bullet("Name: <b>Nyaera Ogega & Co. Advocates</b>", styles))
    story.append(bullet("Email: <b>info@nyaeraogegaadvocates.com</b>", styles))
    story.append(bullet("Password: <b>ah-1YM?2n%Mh</b>", styles))
    story.append(bullet("Description: <b>Firm Email</b>", styles))
    story.append(step(4, "Tap <b>Next</b> — iOS will try to auto-configure", styles))
    story.append(step(5, "If auto-config fails, tap <b>IMAP</b> and enter:", styles))
    story.append(bullet("Incoming Server: <b>mail.truehost.cloud</b> (Port 993, SSL)", styles))
    story.append(bullet("Outgoing Server: <b>mail.truehost.cloud</b> (Port 465, SSL)", styles))
    story.append(step(6, "Tap <b>Save</b>", styles))

    story.append(spacer(0.3))
    story.append(h2("Android (Gmail App)", styles))
    story.append(step(1, "Open <b>Gmail</b> → Tap your profile → <b>Add another account</b>", styles))
    story.append(step(2, "Select <b>Other (IMAP)</b>", styles))
    story.append(step(3, "Enter email: <b>info@nyaeraogegaadvocates.com</b> → <b>Next</b>", styles))
    story.append(step(4, "Select <b>Personal (IMAP)</b>", styles))
    story.append(step(5, "Enter password: <b>ah-1YM?2n%Mh</b> → <b>Next</b>", styles))
    story.append(step(6, "Verify server settings:", styles))
    story.append(bullet("IMAP Server: <b>mail.truehost.cloud</b> (Port 993, SSL)", styles))
    story.append(bullet("SMTP Server: <b>mail.truehost.cloud</b> (Port 465, SSL)", styles))
    story.append(step(7, "Tap <b>Next</b> → <b>Done</b>", styles))

    story.append(PageBreak())

    # ══════════════════════════════════════════════════════════════════
    # 6. RESEND EMAIL PLATFORM GUIDE
    # ══════════════════════════════════════════════════════════════════
    story.append(h1("6. RESEND EMAIL PLATFORM GUIDE", styles))
    story.append(spacer(0.2))

    story.append(body(
        "Resend is the transactional email service used by the website to send "
        "purchase receipts, download links, and admin notifications. It is "
        "configured programmatically via API and does not require daily interaction.", styles))

    story.append(spacer(0.2))
    story.append(body_bold("Resend Dashboard:", styles))
    story.append(info_box(
        '<font color="#f0c675"><b>https://resend.com</b></font>',
        styles
    ))
    story.append(spacer(0.2))

    story.append(h2("Login Credentials", styles))
    story.append(info_box(
        'Email: <b>info@nyaeraogegaadvocates.com</b><br/>'
        'Password: <b>NOstudio2026#</b>',
        styles
    ))
    story.append(spacer(0.3))

    story.append(h2("What Resend Does", styles))
    story.append(bullet("Sends <b>purchase receipt emails</b> to clients after successful payment", styles))
    story.append(bullet("Sends <b>download link emails</b> with secure tokens", styles))
    story.append(bullet("Sends <b>admin order notifications</b> when a new order is placed", styles))
    story.append(bullet("Provides <b>email analytics</b> — delivery rates, open rates, etc.", styles))

    story.append(spacer(0.3))
    story.append(h2("Checking Email Logs", styles))
    story.append(step(1, "Log in to https://resend.com", styles))
    story.append(step(2, "Go to <b>Logs</b> in the left sidebar", styles))
    story.append(step(3, "View sent emails, delivery status, and any failures", styles))
    story.append(step(4, "If an email fails to deliver, check the error details and retry if needed", styles))

    story.append(spacer(0.3))
    story.append(h2("Troubleshooting", styles))
    story.append(bullet("If clients report not receiving emails, check Resend logs first", styles))
    story.append(bullet("Verify the client's email address is correct", styles))
    story.append(bullet("Check that the sender domain (nyaeraogegaadvocates.com) is verified in Resend", styles))
    story.append(bullet("Contact support if emails are consistently failing", styles))

    story.append(PageBreak())

    # ══════════════════════════════════════════════════════════════════
    # 7. HOW TO REGISTER A PAYBILL OR TILL
    # ══════════════════════════════════════════════════════════════════
    story.append(h1("7. HOW TO REGISTER A PAYBILL OR TILL NUMBER", styles))
    story.append(spacer(0.2))

    story.append(body(
        "The website currently uses <b>M-Pesa STK Push</b> (Daraja API) for "
        "payments. This means clients pay directly through the website without "
        "needing a Paybill or Till number. However, if you want to register a "
        "Paybill or Till for other purposes, follow the steps below.", styles))

    story.append(spacer(0.3))
    story.append(h2("Registering a Paybill Number", styles))
    story.append(step(1, "Visit any <b>Safaricom Shop</b> or <b>M-Pesa Agent</b>", styles))
    story.append(step(2, "Request a <b>Paybill Registration Form</b>", styles))
    story.append(step(3, "Fill in:", styles))
    story.append(bullet("Business Name: <b>Nyaera Ogega & Co. Advocates</b>", styles))
    story.append(bullet("Business Type: <b>Law Firm / Legal Services</b>", styles))
    story.append(bullet("ID/BRN Number: Your business registration number", styles))
    story.append(bullet("Contact: Your phone number", styles))
    story.append(step(4, "Submit the form and pay the registration fee (approx. KES 1,000)", styles))
    story.append(step(5, "You will receive your Paybill number within <b>24-48 hours</b>", styles))

    story.append(spacer(0.3))
    story.append(h2("Registering a Till Number", styles))
    story.append(step(1, "Dial <b>*234#</b> on your Safaricom line", styles))
    story.append(step(2, "Select <b>Lipya na M-Pesa</b>", styles))
    story.append(step(3, "Select <b>Register Till Number</b>", styles))
    story.append(step(4, "Follow the prompts to enter your business details", styles))
    story.append(step(5, "Pay the registration fee (KES 1,080 for 1 year)", styles))
    story.append(step(6, "You will receive your Till number immediately", styles))

    story.append(spacer(0.3))
    story.append(h2("Using Paybill/Till with the Website", styles))
    story.append(body(
        "If you want to switch from STK Push to Paybill/Till, the development "
        "team will need to update the payment integration. Contact your developer "
        "to make this change.", styles))

    story.append(PageBreak())

    # ══════════════════════════════════════════════════════════════════
    # 8. QUICK REFERENCE & CREDENTIALS
    # ══════════════════════════════════════════════════════════════════
    story.append(h1("8. QUICK REFERENCE & CREDENTIALS", styles))
    story.append(spacer(0.2))

    story.append(warning_box(
        '<b>⚠️  KEEP THIS DOCUMENT SECURE.</b> The credentials below grant access '
        'to the firm\'s website admin panel, email, and email platform. Do not share '
        'them with anyone outside the firm.',
        styles
    ))
    story.append(spacer(0.3))

    story.append(h2("Important Links", styles))
    story.append(bullet("Live Website: <b>https://www.nyaeraogegaadvocates.com</b>", styles))
    story.append(bullet("Admin Panel: <b>https://www.nyaeraogegaadvocates.com/admin/orders</b>", styles))
    story.append(bullet("Document Marketplace: <b>https://www.nyaeraogegaadvocates.com/documents</b>", styles))
    story.append(bullet("My Purchases: <b>https://www.nyaeraogegaadvocates.com/my-purchases</b>", styles))
    story.append(bullet("Truehost Webmail: <b>https://workplace.truehost.cloud/appsuite</b>", styles))
    story.append(bullet("Resend Dashboard: <b>https://resend.com</b>", styles))

    story.append(spacer(0.4))
    story.append(h2("Credentials Summary", styles))

    # Credentials table
    cred_data = [
        ["Service", "Username / URL", "Password"],
        ["Admin Panel", "nyaeraogegaadvocates.com/admin/orders", "SNO2026Markt1!#"],
        ["Email (IMAP/SMTP)", "info@nyaeraogegaadvocates.com", "ah-1YM?2n%Mh"],
        ["Resend", "info@nyaeraogegaadvocates.com", "NOstudio2026#"],
        ["Truehost Webmail", "info@nyaeraogegaadvocates.com", "ah-1YM?2n%Mh"],
    ]

    cred_table = Table(cred_data, colWidths=[3.5*cm, 7*cm, 5*cm])
    cred_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), NAVY),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, GOLD),
        ('BACKGROUND', (0, 1), (-1, -1), LIGHT_BG),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(cred_table)

    story.append(spacer(0.4))
    story.append(h2("Email Server Settings (Quick Reference)", styles))

    email_settings = [
        ["Setting", "Value"],
        ["Incoming Server (IMAP)", "mail.truehost.cloud  |  Port 993  |  SSL/TLS"],
        ["Outgoing Server (SMTP)", "mail.truehost.cloud  |  Port 465  |  SSL/TLS"],
        ["Authentication", "Password Required (same as incoming)"],
    ]
    email_table = Table(email_settings, colWidths=[5*cm, 11*cm])
    email_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), NAVY),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, GOLD),
        ('BACKGROUND', (0, 1), (-1, -1), LIGHT_BG),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(email_table)

    story.append(spacer(0.4))
    story.append(h2("Admin Panel Quick Guide", styles))
    story.append(step(1, "Go to <b>/admin/orders</b> → View all pending orders", styles))
    story.append(step(2, "Click an order → Review <b>Client Instructions</b>", styles))
    story.append(step(3, "Draft the document → Click <b>Upload Draft</b> → Select PDF", styles))
    story.append(step(4, "Click <b>Upload to Supabase Storage</b> → Status becomes <b>Completed</b>", styles))
    story.append(step(5, "Client receives email notification with download link", styles))
    story.append(step(6, "Use <b>COMPLETED</b> filter to view all finished orders", styles))

    story.append(spacer(0.5))
    story.append(h2("Need Help?", styles))
    story.append(body(
        "If you encounter any issues with the website, email, or admin panel, "
        "contact your developer for support. Keep this manual in a safe place "
        "for future reference.", styles))

    story.append(spacer(0.3))
    story.append(body_bold("Nyaera Ogega & Co. Advocates", styles))
    story.append(body("Shelter Afrique Building, Mamlaka Road", styles))
    story.append(body("3rd Floor, Room 4", styles))
    story.append(body("Nairobi, Kenya", styles))

    return story


# ═══════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════
def main():
    """Generate the PDF manual."""
    print("📄 Generating Nyaera Ogega Website Instruction Manual...")
    print(f"   Output: {OUTPUT_FILE}")

    styles = build_styles()
    story = build_content(styles)

    doc = SimpleDocTemplate(
        OUTPUT_FILE,
        pagesize=A4,
        rightMargin=1.5*cm,
        leftMargin=1.5*cm,
        topMargin=1.5*cm,
        bottomMargin=1.8*cm,
    )

    doc.build(story, onFirstPage=draw_cover, onLaterPages=draw_footer)
    print(f"✅ PDF generated successfully: {OUTPUT_FILE}")
    print(f"   File size: {os.path.getsize(OUTPUT_FILE) / 1024:.1f} KB")


if __name__ == "__main__":
    main()
