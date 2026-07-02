// resume.js — Handles PDF generation and email sending

const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const transporter = require('../utils/mailer');

// Generates a PDF from form data and returns it as a Buffer
function generatePDFBuffer(data) {
  return new Promise((resolve, reject) => {
    const {
      fullName,
      email,
      phone,
      education,
      skills,
      projectTitle,
      projectDescription,
    } = data;

    const doc = new PDFDocument({ margin: 50 });

    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // --- NAME ---
    doc
      .fontSize(26)
      .font('Helvetica-Bold')
      .text(fullName || 'Your Name', { align: 'center' });

    doc.moveDown(0.3);

    // --- CONTACT INFO ---
    doc
      .fontSize(11)
      .font('Helvetica')
      .text(`${email || ''}   |   ${phone || ''}`, { align: 'center' });

    // Horizontal divider
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

    doc
      .fontSize(11)
      .font('Helvetica-Bold')
      .text(projectTitle || '');

    doc.moveDown(0.2);
    doc
      .fontSize(11)
      .font('Helvetica')
      .text(projectDescription || '');

    doc.end();
  });
}

// POST /api/generate-resume
router.post('/generate-resume', async (req, res) => {
  try {
    const { fullName, email } = req.body;

    // Step 1 — Validate email exists before doing any work
    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    // Step 2 — Generate the PDF buffer
    const pdfBuffer = await generatePDFBuffer(req.body);

    // Step 3 — Send the email with PDF attached
    await transporter.sendMail({
      from: `"Resume Generator" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Resume - ${fullName || 'Resume'}`,
      text: `Hi ${fullName || 'there'},\n\nPlease find your generated resume attached.\n\nBest regards,\nResume Generator`,
      attachments: [
        {
          filename: `${(fullName || 'resume').replace(/\s+/g, '_')}-resume.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    // Step 4 — Tell the frontend it worked
    res.status(200).json({
      message: 'Resume sent successfully',
      sentTo: email,
    });

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to generate or send resume' });
  }
});

module.exports = router;