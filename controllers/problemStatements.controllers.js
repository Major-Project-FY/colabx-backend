// module imports
import { Op } from 'sequelize';

// importing database models
import { ProblemStatement } from '../models/problemStatements.js';

// importing helper functions
import { getSkillsByIDs } from '../utils/others/skills.utils.js';

// API for saving problem statement post
export const postProblemStatement = (req, res, next) => {
  try {
    const newProblemStatement = new ProblemStatement({
      user_id: res.locals.user.userID,
      problem_statement_text: req.body.problemStatement,
      urls: req.body.urls,
      skills_required: req.body.skillsIDs,
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
        ['skills_required', 'skillIDs'],
      ],
      where: {
        id: { [Op.eq]: req.params.statementID },
      },
    });
    const skills = await getSkillsByIDs(statement.dataValues.skillIDs);
    statement.dataValues.skills = skills;
    delete statement.dataValues.skillIDs;
    if (statement) {
      res.status(200).json(statement.dataValues);
    } else {
      res.status(404).json({
        status: 'unsuccessful',
        msg: 'statement post not found',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'unsuccessful',
      msg: 'statement post not found',
    });
  }
};
