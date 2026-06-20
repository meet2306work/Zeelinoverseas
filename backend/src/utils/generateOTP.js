const crypto = require('crypto');

const generateOTP = () => {
  // Generate a cryptographically secure random 6-digit number
  return crypto.randomInt(100000, 1000000).toString();
};

module.exports = generateOTP;
