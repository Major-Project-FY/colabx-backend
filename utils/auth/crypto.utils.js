// module imports
import { genSalt, hash } from 'bcrypt';

// helper function for hashing user passwords
export const hashPassword = (userPassword) => {
  return new Promise((resolve, reject) => {
    // bcrypt salt rounds
    const saltRounds = 12;

    // generating hash and resolving promise
    genSalt(saltRounds, function (err, salt) {
      if (err) {
        reject(err);
      } else {
        console.log(userPassword, salt);
        hash(userPassword, salt, function (err, hashedPassword) {
          if (err) {
            reject(err);
          } else {
            resolve(hashedPassword);
          }
        });
      }
    });
  });
};

// helper function to compare passwords
export const comparePassword = (currentPassword, hashedPassword) => {
  return new Promise((resolve, reject) => {
    if (currentPassword === hashedPassword) {
      return resolve(true);
    } else {
      return reject(false);
    }
  });
};
