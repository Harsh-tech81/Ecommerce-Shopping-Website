const VerificationEmail = (username, otp) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Email Verification OTP</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background: #f4f4f4;
                    color: #333;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    background: #fff;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.08);
                }
                .header {
                    text-align: center;
                    margin-bottom: 16px;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 10px;
                }
                .header h1 {
                    margin: 0;
                    color: #4caf50;
                    font-size: 22px;
                }
                .content {
                    text-align: center;
                }
                .content p {
                    font-size: 15px;
                    line-height: 1.5;
                }
                .otp {
                    display: inline-block;
                    margin: 16px 0;
                    padding: 10px 18px;
                    border-radius: 6px;
                    background: #eaf8ec;
                    color: #4caf50;
                    font-size: 24px;
                    font-weight: 700;
                    letter-spacing: 2px;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    color: #777;
                    font-size: 13px;
                }
            </style>
    </head>
    <body>
            <div class="container">
                <div class="header">
                    <h1>Email Verification Request</h1>
                </div>
                <div class="content">
                    <p>Hi ${username}</p>
                    <p>Use this OTP to verify your email address. This code is valid for 10 minutes.</p>
                    <div class="otp">${otp}</div>
                    <p>If you did not create an account, you can ignore this email.</p>
                </div>
                <div class="footer">
                    <p>&copy; 2026 Ecommerce App. All rights reserved.</p>
        </div>
            </div>
    </body>
    </html>
    `;
};

export default VerificationEmail;
