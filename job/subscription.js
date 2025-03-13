const cron = require('node-cron');
const User = require('../models/user');
const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com', // Replace with your email
        pass: 'your-email-password', // Replace with your password or app password
    },
});

// Cron job: Runs every day at 9 AM
cron.schedule('0 9 * * *', async () => {
    console.log('Running daily subscription check...');

    const currentDate = new Date();
    const users = await User.find({});

    users.forEach(async (user) => {
        const warningDate = new Date(user.subscriptionEndDate);
        warningDate.setDate(warningDate.getDate() - 10); // 10 days before expiry

        // Send email reminder if subscription is expiring soon
        if (currentDate >= warningDate && currentDate < user.subscriptionEndDate && !user.paymentStatus) {
            const mailOptions = {
                from: 'your-email@gmail.com',
                to: user.email,
                subject: 'Payment Reminder',
                text: 'Your subscription will expire in 10 days. Please make a payment to continue using our service.',
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error sending reminder email:', error);
                } else {
                    console.log(`Reminder email sent to ${user.email}`);
                }
            });
        }

        // If subscription has expired, disable the account
        if (currentDate >= user.subscriptionEndDate) {
            user.paymentStatus = false; // Disable account
            await user.save();
            console.log(`User ${user.email} subscription expired. Account disabled.`);
        }
    });
});

console.log('Cron job for subscription reminders and expiry handling initialized.');
