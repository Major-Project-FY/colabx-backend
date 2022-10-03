import chalk from "chalk";

export const log = {
  red: (text) => {
    console.log(chalk.red(text));
  },
  green: (text) => {
    console.log(chalk.green(text));
  },
  yellow: (text) => {
    console.log(chalk.yellow(text));
  },
  gray: (text) => {
    console.log(chalk.gray(text));
  },
};

export const text = {
  red: (text) => {
    return chalk.red(text);
  },
  green: (text) => {
    return chalk.green(text);
  },
  yellow: (text) => {
    return chalk.yellow(text);
  },
  gray: (text) => {
    return chalk.gray(text);
  },
};
