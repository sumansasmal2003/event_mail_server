const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Function to send emails
const sendEmails = async (subject, content, emails) => {
    try {
        // Ensure emails is an array and contains valid email addresses
        if (!Array.isArray(emails) || emails.length === 0) {
            throw new Error('Invalid or empty emails array');
        }

        // Configure email options with HTML content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: emails.join(','),
            subject: subject,
            html: `
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            background-color: #f0f0f0;
                            padding: 20px;
                        }
                        .email-container {
                            background-color: #ffffff;
                            border-radius: 8px;
                            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                            padding: 20px;
                            margin: 20px;
                        }
                        h1 {
                            color: #333333;
                        }
                        p {
                            color: #555555;
                        }
                        a {
                            color: #007bff;
                            text-decoration: none;
                        }
                        .club-name {
                            font-size: 24px;
                            font-weight: bold;
                            margin-bottom: 10px;
                            color: #ff6600;
                        }
                        .event-details {
                            margin-bottom: 20px;
                        }
                        .event-details h2 {
                            color: #3366cc;
                        }
                        .event-details p {
                            font-size: 16px;
                        }
                        .cta-link {
                            margin-top: 20px;
                        }
                        .cta-link a {
                            background-color: #007bff;
                            color: #ffffff;
                            padding: 10px 20px;
                            border-radius: 5px;
                            text-decoration: none;
                            display: inline-block;
                        }
                        .cta-link a:hover {
                            background-color: #0056b3;
                        }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <div class="club-name">Sijgeria Umesh Chnadra Smriti Sangha</div>
                        <div class="event-details">
                            <h2>${subject}</h2>
                            <p><strong>Event Name:</strong> ${content.eventName}</p>
                            <p><strong>Event Date:</strong> ${content.eventDate}</p>
                            <p><strong>Registration Deadline:</strong> ${content.deadlineDate}</p>
                            <p><strong>Event Time:</strong> ${content.eventTime}</p>
                        </div>
                        <div class="cta-link">
                            <a href="https://sucss.netlify.app/">Click here to visit our website</a>
                        </div>
                    </div>
                </body>
                </html>
            `,
        };

        // Send email
        await transporter.sendMail(mailOptions);
        console.log('Emails sent successfully');
    } catch (error) {
        console.error('Error sending emails:', error);
        throw error; // Throw error to handle in calling function
    }
};

// Route to handle sending event emails
app.post('/send-event-emails', async (req, res) => {
    const { eventName, eventDate, deadlineDate, eventTime, emails } = req.body;

    try {
        if (!emails || !Array.isArray(emails) || emails.length === 0) {
            return res.status(400).json({ error: 'Invalid or empty emails array' });
        }

        // Send email to users
        const subject = `New Event: ${eventName}`;
        const content = { eventName, eventDate, deadlineDate, eventTime };

        await sendEmails(subject, content, emails);

        res.status(200).json({ message: 'Event details sent to users successfully!' });
    } catch (error) {
        console.error('Error sending event details:', error);
        res.status(500).json({ error: 'Failed to send event details to users. Please try again.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
