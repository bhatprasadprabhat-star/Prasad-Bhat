
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for sending email
  app.post('/api/send-appointment-email', async (req, res) => {
    const { name, contact, date, time, reason, tier } = req.body;

    // Recipient email
    const RECIPIENT_EMAIL = 'bhatprasadprabhat@gmail.com';

    console.log('--- Email Request Received ---');
    console.log(`To: ${RECIPIENT_EMAIL}`);
    console.log('Details:', { name, contact, date, time, reason, tier });

    try {
      // Use provided credentials as fallback if env vars are missing
      const emailUser = process.env.EMAIL_USER || 'bhatprasadprabhat@gmail.com';
      const emailPass = process.env.EMAIL_PASS || 'idbcaovvnrqxsbgz';

      console.log(`Using email user: ${emailUser}`);
      
      if (emailUser && emailPass) {
        console.log('Attempting to send email via SMTP (Gmail)...');
        
        // Using port 587 with STARTTLS for better compatibility
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: emailUser,
            pass: emailPass
          },
          tls: {
            rejectUnauthorized: false
          },
          connectionTimeout: 15000,
          greetingTimeout: 15000,
          socketTimeout: 15000
        });

        // Verify connection configuration
        try {
          await transporter.verify();
          console.log('SMTP connection verified');
        } catch (verifyError: any) {
          console.error('SMTP Verification Failed:', verifyError);
          return res.status(401).json({ 
            success: false, 
            error: 'AUTH_FAILED', 
            message: `Authentication failed: ${verifyError.message}. Ensure you are using a Gmail App Password.` 
          });
        }

        const mailOptions = {
          from: `"ASTRO LOGIC Booking" <${emailUser}>`,
          to: RECIPIENT_EMAIL,
          subject: `New Appointment: ${name} - ${date} ${time}`,
          text: `
            New appointment scheduled through ASTRO LOGIC App:
            
            Name: ${name}
            Contact: ${contact}
            Date: ${date}
            Time: ${time}
            Tier/Plan: ${tier || 'Not specified'}
            Reason/Problem: ${reason}
            
            Sent at: ${new Date().toLocaleString()}
          `,
          html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #D4AF37; border-radius: 10px; background-color: #fffbeb;">
              <h2 style="color: #451a03; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">New Appointment Scheduled</h2>
              <div style="margin-top: 20px; color: #451a03;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Contact:</strong> ${contact}</p>
                <p><strong>Date:</strong> ${date}</p>
                <p><strong>Time:</strong> ${time}</p>
                <p><strong>Tier/Plan:</strong> ${tier || 'Not specified'}</p>
                <p><strong>Reason/Problem:</strong> ${reason}</p>
              </div>
              <hr style="border: 0; border-top: 1px solid #D4AF37; margin: 20px 0; opacity: 0.3;" />
              <p style="font-size: 12px; color: #92400e; font-style: italic;">This is an automated notification from your ASTRO LOGIC application.</p>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ Appointment email sent successfully');
        res.json({ success: true, message: 'Email sent successfully' });
      } else {
        console.warn('⚠️ Email NOT sent: Missing EMAIL_USER or EMAIL_PASS');
        res.json({ 
          success: false, 
          error: 'SMTP_NOT_CONFIGURED',
          message: 'Email simulation mode active. Please configure EMAIL_USER and EMAIL_PASS in Settings.' 
        });
      }
    } catch (error: any) {
      console.error('Failed to send appointment email:', error);
      
      let message = error.message || 'Unknown error occurred while sending email';
      if (message.includes('Application-specific password required')) {
        message = 'Gmail Error: Application-specific password required. Please generate an App Password at https://myaccount.google.com/apppasswords and use it in EMAIL_PASS.';
      }

      res.status(500).json({ 
        success: false, 
        error: 'SEND_FAILED', 
        message
      });
    }
  });

  // API Route for sending feedback
  app.post('/api/send-feedback', async (req, res) => {
    const { rating, comment } = req.body;

    // Recipient email
    const RECIPIENT_EMAIL = 'bhatprasadprabhat@gmail.com';

    console.log('--- Feedback Received ---');
    console.log(`To: ${RECIPIENT_EMAIL}`);
    console.log('Details:', { rating, comment });

    try {
      // Use provided credentials as fallback if env vars are missing
      const emailUser = process.env.EMAIL_USER || 'bhatprasadprabhat@gmail.com';
      const emailPass = process.env.EMAIL_PASS || 'idbcaovvnrqxsbgz';

      console.log(`Using email user: ${emailUser}`);

      if (emailUser && emailPass) {
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: emailUser,
            pass: emailPass
          },
          tls: {
            rejectUnauthorized: false
          },
          connectionTimeout: 15000,
          greetingTimeout: 15000,
          socketTimeout: 15000
        });

        const mailOptions = {
          from: `"ASTRO LOGIC Feedback" <${emailUser}>`,
          to: RECIPIENT_EMAIL,
          subject: `New Feedback: ${rating} Stars`,
          text: `
            New feedback received from ASTRO LOGIC App:
            
            Rating: ${rating} / 5 Stars
            Comment: ${comment}
            
            Sent at: ${new Date().toLocaleString()}
          `,
          html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #D4AF37; border-radius: 10px; background-color: #fffbeb;">
              <h2 style="color: #451a03; border-bottom: 20px solid #D4AF37; padding-bottom: 10px;">New Sacred Feedback</h2>
              <div style="margin-top: 20px; color: #451a03;">
                <p><strong>Rating:</strong> ${rating} / 5 Stars</p>
                <p><strong>Comment:</strong> ${comment}</p>
              </div>
              <hr style="border: 0; border-top: 1px solid #D4AF37; margin: 20px 0; opacity: 0.3;" />
              <p style="font-size: 12px; color: #92400e; font-style: italic;">This is an automated notification from your ASTRO LOGIC application.</p>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ Feedback email sent successfully');
        res.json({ success: true, message: 'Feedback sent successfully' });
      } else {
        console.warn('⚠️ Feedback email NOT sent: Missing EMAIL_USER or EMAIL_PASS.');
        res.json({ 
          success: false, 
          error: 'SMTP_NOT_CONFIGURED',
          message: 'Email credentials not configured.' 
        });
      }
    } catch (error: any) {
      console.error('Failed to send feedback email:', error);
      
      let message = error.message || 'Unknown error occurred while sending feedback';
      if (message.includes('Application-specific password required')) {
        message = 'Gmail Error: Application-specific password required. Please generate an App Password at https://myaccount.google.com/apppasswords and use it in EMAIL_PASS.';
      }

      res.status(500).json({ 
        success: false, 
        error: 'SEND_FAILED', 
        message
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
