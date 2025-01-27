const otpTemplate = (otp: string): string => {
  return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>OTP Verification Email</title>
        <style>
            body {
                background-color: #f4f4f9;
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                font-size: 14px;
                line-height: 1.5;
                color: #333;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .logo {
                max-width: 160px;
                margin-bottom: 20px;
            }
            .message {
                font-size: 20px;
                font-weight: bold;
                color: #333333;
                margin-bottom: 20px;
            }
            .body {
                font-size: 16px;
                margin-bottom: 20px;
                color: #555555;
            }
            .highlight {
                font-size: 20px;
                font-weight: bold;
                color: #4a90e2;
            }
            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }
            .cta {
                display: inline-block;
                padding: 10px 22px;
                background-color: #4CAF50;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                font-size: 14px;
                font-weight: bold;
                margin-top: 20px;
            }
            .cta:hover {
                background-color: #45a049;
            }
        </style>
      </head>
      <body>
        <div class="container">
            <a href="https://yourwebsite.com">
                <img class="logo" src="https://i.ibb.co/7Xyj3PC/logo.png" alt="Your Logo">
            </a>
            <div class="message">OTP Verification</div>
            <div class="body">
                <p>Dear User,</p>
                <p>Thank you for registering with Company. To complete your registration, please use the following OTP (One-Time Password) to verify your account:</p>
                <h2 class="highlight">${otp}</h2>
                <p>This OTP is valid for 5 minutes. If you did not request this verification, please disregard this email.</p>
                <p>Once your account is verified, you will have access to our platform and its features.</p>
            </div>
            <a class="cta" href="https://yourwebsite.com/verify">Verify Your Account</a>
            <div class="support">
                If you have any questions or need assistance, please reach out to us at
                <a href="mailto:support@yourcompany.com">support@yourcompany.com</a>. We are here to help!
            </div>
        </div>
      </body>
      </html>`;
};

export default otpTemplate;
