// testEmail.js — Run this once to confirm email works
// Delete this file after testing

require('dotenv').config();
const transporter = require('./utils/mailer');

async function testEmail() {
  try {
    const info = await transporter.sendMail({
      from: `"Resume Generator" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // sending to yourself as a test
      subject: 'Test Email from Resume App',
      text: 'If you see this, Nodemailer is working correctly!',
    });

    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
  }
}

testEmail();