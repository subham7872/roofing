const nodemailer = require('nodemailer');

// Brevo (formerly Sendinblue) SMTP configuration
// Free tier: 300 emails/day
const createTransporter = () => {
  // You can use Brevo SMTP or any other email service
  // For Brevo: smtp-relay.brevo.com, port 587
  const smtpUser = process.env.SMTP_USER || process.env.BREVO_EMAIL;
  const smtpPass = process.env.SMTP_PASSWORD || process.env.BREVO_PASSWORD;
  
  if (!smtpUser || !smtpPass) {
    throw new Error('SMTP credentials not configured. Please set SMTP_USER and SMTP_PASSWORD in .env file');
  }
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: smtpUser,
      pass: smtpPass
    },
    // Add connection timeout
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
  });

  // Verify transporter configuration (async, won't block)
  transporter.verify((error, success) => {
    if (error) {
      console.error('SMTP Configuration Error:', error);
    } else {
      console.log('SMTP Server is ready to send emails');
    }
  });

  return transporter;
};

// Send email to user
const sendUserConfirmationEmail = async (userEmail, userName, serviceName) => {
  try {
    const transporter = createTransporter();
    
    // IMPORTANT: Use verified sender email as FROM address
    // The FROM_EMAIL must match a verified sender in Brevo Dashboard
    // Default to subham.kbsinstitute@gmail.com (verified sender shown in Brevo)
    const fromEmail = process.env.FROM_EMAIL || 'subham.kbsinstitute@gmail.com';
    const replyToEmail = process.env.REPLY_TO_EMAIL || fromEmail;
    
    const mailOptions = {
      from: `servicePilot <${fromEmail}>`, // Use verified sender name from Brevo
      replyTo: replyToEmail,
      to: userEmail,
      subject: 'Emergency Request Received - RestorePro Services',
      // Add headers for better deliverability
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      },
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .button { display: inline-block; padding: 12px 24px; background: #dc2626; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>RESTOREPRO SERVICES</h1>
            </div>
            <div class="content">
              <h2>Thank You, ${userName}!</h2>
              <p>We have received your emergency request for <strong>${serviceName}</strong>.</p>
              <p>Our team has been dispatched and a project manager will contact you within <strong>5 minutes</strong>.</p>
              <p><strong>What happens next:</strong></p>
              <ul>
                <li>You will receive a call from our team within 5 minutes</li>
                <li>We'll assess your situation and provide immediate assistance</li>
                <li>Our certified technicians will arrive at your location</li>
              </ul>
              <p>If this is a life-threatening emergency, please call 911 immediately.</p>
              <p>Best regards,<br>The RestorePro Team</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('User confirmation email sent:', info.messageId);
    console.log('  To:', userEmail);
    console.log('  From:', fromEmail);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending user confirmation email:', error);
    console.error('  Error details:', {
      code: error.code,
      command: error.command,
      response: error.response
    });
    return { success: false, error: error.message };
  }
};

// Send email to owner
const sendOwnerNotificationEmail = async (requestData) => {
  try {
    const transporter = createTransporter();
    // Use business owner email if provided, otherwise fallback to env or business email
    const ownerEmail = requestData.ownerEmail || 
                       requestData.businessEmail || 
                       process.env.OWNER_EMAIL || 
                       'pintuduttafkt@gmail.com';
    
    // IMPORTANT: Use verified sender email as FROM address
    // The FROM_EMAIL must match a verified sender in Brevo Dashboard
    // Default to subham.kbsinstitute@gmail.com (verified sender shown in Brevo)
    const fromEmail = process.env.FROM_EMAIL || 'subham.kbsinstitute@gmail.com';
    const replyToEmail = process.env.REPLY_TO_EMAIL || fromEmail;
    
    const mailOptions = {
      from: `servicePilot <${fromEmail}>`, // Use verified sender name from Brevo
      replyTo: replyToEmail,
      to: ownerEmail,
      subject: `New Emergency Request: ${requestData.serviceName}`,
      // Add headers for better deliverability
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      },
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .info-box { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #dc2626; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>NEW EMERGENCY REQUEST</h1>
            </div>
            <div class="content">
              <h2>Emergency Request Details</h2>
              <div class="info-box">
                <p><strong>Business:</strong> ${requestData.businessName || 'N/A'}</p>
                <p><strong>Service:</strong> ${requestData.serviceName}</p>
                <p><strong>Customer Name:</strong> ${requestData.name || requestData.fullName}</p>
                <p><strong>Email:</strong> ${requestData.email}</p>
                <p><strong>Phone:</strong> ${requestData.phone || requestData.mobileNumber}</p>
                <p><strong>Pincode:</strong> ${requestData.pincode || requestData.zipCode}</p>
                <p><strong>Urgency:</strong> <span style="color: ${requestData.urgency === 'emergency' ? '#dc2626' : '#f59e0b'}">${requestData.urgency?.toUpperCase() || 'NORMAL'}</span></p>
                <p><strong>Intent:</strong> ${requestData.intent || 'inquiry'}</p>
                <p><strong>Description:</strong> ${requestData.description || 'No description provided'}</p>
                <p><strong>Lead ID:</strong> ${requestData._id || requestData.id}</p>
                <p><strong>Submitted:</strong> ${new Date(requestData.createdAt || Date.now()).toLocaleString()}</p>
              </div>
              <p><strong>Action Required:</strong> Contact customer within 5 minutes.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Owner notification email sent:', info.messageId);
    console.log('  To:', ownerEmail);
    console.log('  From:', fromEmail);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending owner notification email:', error);
    console.error('  Error details:', {
      code: error.code,
      command: error.command,
      response: error.response
    });
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendUserConfirmationEmail,
  sendOwnerNotificationEmail,
  createTransporter
};

