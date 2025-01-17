import nodemailer from 'nodemailer';

// Set up the transporter for sending emails (example with Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bhaveshnair15@gmail.com',  // Your email address
    pass: 'byqfypeuqvcfnfxo',  // Your email password or App Password
  },
});

// Function to generate OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit numeric OTP
};

// Function to send OTP email
export const sendOTP = async (email: string): Promise<string> => {
  const otp = generateOTP();
  console.log(otp)
  // Mail options for sending OTP
  const mailOptions = {
    from: 'bhaveshnair15@gmail.com',
    to: email,
    subject: 'OTP Code for Registration',
    text: `Your OTP code is: ${otp}`,
  };

  try {
    // Send the OTP to the user's email
    await transporter.sendMail(mailOptions);
    return otp;
  } catch (error) {
    throw new Error('Failed to send OTP email');
  }
};
