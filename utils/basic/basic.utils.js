export const currentDate = () => {
  return new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
};

// helper funtion to get 4 digit OTP
export const getOTP = () => {
  const val = Math.floor(1000 + Math.random() * 9000);
  return val.toString();
};
