// module imports
import { Op } from 'sequelize';

// importing database models
import { ProblemStatement } from '../models/problemStatements.js';

// API for saving problem statement post
export const postProblemStatement = (req, res, next) => {
  try {
    const newProblemStatement = new ProblemStatement({
      user_id: res.locals.user.userID,
      problem_statement_text: req.body.problemStatement,
      urls: req.body.urls,
    });
    newProblemStatement
      .save()
      .then((savedStatement) => {
        res.status(200).json({
          status: 'successfull',
          statementID: savedStatement.dataValues.id,
          msg: 'Problem Statement Added',
        });
      })
      .catch((err) => {
        throw err;
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'unsuccessful',
    });
  }
};

export const getProblemStatement = async (req, res, next) => {
  try {
    const statement = await ProblemStatement.findOne({
      attributes: [
        ['id', 'postID'],
        ['user_id', 'userID'],
        ['problem_statement_text', 'statementText'],
        ['urls', 'postURLs'],
      ],
      where: {
        id: { [Op.eq]: req.params.statementID },
      },
    });
    if (statement) {
      res.status(200).json(statement.dataValues);
    } else {
      res.status(404).json({
        status: 'unsuccessful',
        msg: 'statement post not found',
      });
    }
  } catch (error) {}
};
