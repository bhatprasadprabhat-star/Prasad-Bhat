
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
    const { name, contact, date, time, reason } = req.body;

    // For now, we'll use a mock transporter or a real one if credentials provided
    // Since we don't have real credentials, we'll log it and return success
    // In a real app, you'd use process.env.SMTP_USER, etc.
    
    console.log('--- Email Request Received ---');
    console.log('To: prasadprabhat2004@gmail.com');
    console.log('Details:', { name, contact, date, time, reason });

    try {
      const emailUser = process.env.EMAIL_USER;
      const emailPass = process.env.EMAIL_PASS;

      if (emailUser && emailPass) {
        console.log('Attempting to send email via SMTP (Gmail)...');
        
        // Using more explicit configuration for Gmail
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: emailUser,
            pass: emailPass
          },
          // Add timeout to prevent hanging
          connectionTimeout: 10000,
          greetingTimeout: 10000,
          socketTimeout: 10000
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
          from: `"AstroLogic Booking" <${emailUser}>`,
          to: 'prasadprabhat2004@gmail.com',
          subject: `New Appointment: ${name} - ${date} ${time}`,
          text: `
            New appointment scheduled through AstroLogic App:
            
            Name: ${name}
            Contact: ${contact}
            Date: ${date}
            Time: ${time}
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
                <p><strong>Reason/Problem:</strong> ${reason}</p>
              </div>
              <hr style="border: 0; border-top: 1px solid #D4AF37; margin: 20px 0; opacity: 0.3;" />
              <p style="font-size: 12px; color: #92400e; font-style: italic;">This is an automated notification from your AstroLogic application.</p>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully via SMTP');
        res.json({ success: true, message: 'Email sent successfully' });
      } else {
        console.warn('⚠️ Email NOT sent: Missing EMAIL_USER or EMAIL_PASS in environment variables.');
        res.json({ 
          success: false, 
          error: 'SMTP_NOT_CONFIGURED',
          message: 'Email simulation mode active. Please configure EMAIL_USER and EMAIL_PASS in Settings.' 
        });
      }
    } catch (error: any) {
      console.error('Failed to send email:', error);
      res.status(500).json({ 
        success: false, 
        error: 'SEND_FAILED', 
        message: error.message || 'Unknown error occurred while sending email' 
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
