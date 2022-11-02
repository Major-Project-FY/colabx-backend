import { text } from './color.logger.js';

export const successLog = (text, part) => {
  console.log(
    `[${text.yellow()}] : ${text.green(part)} -> ${text.green(text)}`
  );
};
