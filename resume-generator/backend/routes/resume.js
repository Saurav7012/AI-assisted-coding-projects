// resume.js — Handles PDF generation for POST /api/generate-resume

const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');

// POST /api/generate-resume
router.post('/generate-resume', (req, res) => {
  // Pull resume data from the request body
  const {
    fullName,
    email,
    phone,
    education,
    skills,
    projectTitle,
    projectDescription,
  } = req.body;

  // --- PDF Setup ---
  // Create a new PDF document (A4-ish, letter size by default)
  const doc = new PDFDocument({ margin: 50 });

  // Tell the browser this response is a PDF file, not JSON
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    'attachment; filename="resume.pdf"'
  );

  // Pipe the PDF output directly into the HTTP response stream
  doc.pipe(res);

  // -----------------------------------------------
  // PDF CONTENT
  // -----------------------------------------------

  // --- NAME (big heading at the top) ---
  doc
    .fontSize(26)
    .font('Helvetica-Bold')
    .text(fullName || 'Your Name', { align: 'center' });

  // Small vertical gap
  doc.moveDown(0.3);

  // --- CONTACT INFO (email and phone on one line) ---
  doc
    .fontSize(11)
    .font('Helvetica')
    .text(`${email || ''}   |   ${phone || ''}`, { align: 'center' });

  // Horizontal divider line
  doc.moveDown(0.8);
  doc
    .moveTo(50, doc.y)
    .lineTo(562, doc.y)
    .strokeColor('#333333')
    .lineWidth(1)
    .stroke();
  doc.moveDown(0.8);

  // --- EDUCATION ---
  doc
    .fontSize(13)
    .font('Helvetica-Bold')
    .text('EDUCATION');

  doc.moveDown(0.3);
  doc
    .fontSize(11)
    .font('Helvetica')
    .text(education || '');

  doc.moveDown(0.8);

  // --- SKILLS ---
  doc
    .fontSize(13)
    .font('Helvetica-Bold')
    .text('SKILLS');

  doc.moveDown(0.3);
  doc
    .fontSize(11)
    .font('Helvetica')
    .text(skills || '');

  doc.moveDown(0.8);

  // --- PROJECT ---
  doc
    .fontSize(13)
    .font('Helvetica-Bold')
    .text('PROJECT');

  doc.moveDown(0.3);

  // Project title in bold, description in regular
  doc
    .fontSize(11)
    .font('Helvetica-Bold')
    .text(projectTitle || '');

  doc.moveDown(0.2);
  doc
    .fontSize(11)
    .font('Helvetica')
    .text(projectDescription || '');

  // -----------------------------------------------
  // Finalize the PDF — this flushes and closes the stream
  doc.end();
});

module.exports = router;