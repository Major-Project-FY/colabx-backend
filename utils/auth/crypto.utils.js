// module imports
import { genSalt, hash, compare } from 'bcrypt';

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
  try {
    try {
      console.log(currentPassword, hashedPassword);
      const compairedResult = compare(currentPassword, hashedPassword);
      if (compairedResult) {
        return true;
      }
    } catch (error) {
      throw error;
    }
    const err = new Error('Incorrect credentials recieved');
    err.code = 'LOGIN-INCRCTUSRCRED';
    return err;
  } catch (error) {
    return error;
  }
};
