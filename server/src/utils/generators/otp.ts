/**
 * Generate a 6-digit OTP
 * @return {string} - Returns a 6-digit OTP
 */
const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export { generateOtp };
