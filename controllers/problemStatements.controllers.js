import { json } from 'sequelize';
import { ProblemStatement } from '../models/problemStatements.js';

export const postProblemStatement = (req, res, next) => {
  const newProblemStatement = new ProblemStatement({
    user_id: res.locals.user.userID,
    problem_statement_text: req.body.problemStatement,
    urls: req.body.urls,
  });
  newProblemStatement
    .save()
    .then((saveResult) => {
      res
        .status(200)
        .json({ status: 'successfull', msg: 'Problem Statement Added' });
    })
    .catch((err) => {
      throw err;
    });
  try {
  } catch (error) {}
};
