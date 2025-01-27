const onboardingTemplate = (name: string): string => {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Welcome Email</title>
    <style>
        body {
            background-color: #f4f4f9;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 14px;
            line-height: 1.6;
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
            font-size: 24px;
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
            font-size: 18px;
            font-weight: bold;
            color: #4a90e2;
        }
        .cta {
            display: inline-block;
            padding: 12px 24px;
            background-color: #4CAF50;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: bold;
            margin-top: 20px;
        }
        .cta:hover {
            background-color: #45a049;
        }
        .footer {
            font-size: 12px;
            color: #999999;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <a href="https://yourwebsite.com">
            <img class="logo" src="https://i.ibb.co/7Xyj3PC/logo.png" alt="Your Logo">
        </a>
        <div class="message">Welcome to Company!</div>
        <div class="body">
            <p>Hi <span class="highlight">${name}</span>,</p>
            <p>We are thrilled to have you on board! Thank you for joining <b>Company</b>. We are committed to providing you with an exceptional experience.</p>
            <p>Here are some quick links to help you get started:</p>
        </div>
        <a class="cta" href="https://yourwebsite.com/dashboard">Go to Your Dashboard</a>
        <a class="cta" href="https://yourwebsite.com/help">Get Support</a>
        <div class="body">
            <p>We hope you enjoy exploring our platform. If you have any questions or need assistance, feel free to reach out to us.</p>
        </div>
        <div class="footer">
            If you have any questions, contact us at
            <a href="mailto:support@yourcompany.com">support@yourcompany.com</a>
        </div>
    </div>
</body>
</html>
`;
};

export default onboardingTemplate;
