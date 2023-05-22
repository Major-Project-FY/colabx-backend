// module imports
import { Op, Sequelize, literal } from 'sequelize';

// importing database models
import { ProblemStatement } from '../models/problemStatements.js';
import { User } from '../models/user.js';

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

export const getStatementPostsForFeed = async (req, res, next) => {
  const { userID } = res.locals.user;
  const randomRows = await ProblemStatement.findAll({
    attributes: [
      ['id', 'postID'],
      ['user_id', 'userID'],
      ['problem_statement_text', 'statementText'],
      ['urls', 'postURLs'],
      ['skills_required', 'skillIDs'],
      [literal(`"users"."first_name" || ' ' || "users"."last_name"`), 'name'],
    ],
    include: [
      {
        model: User,
        as: 'users',
        attributes: [
          // ['first_name', 'firstName'],
          // ['last_name', 'lastName'],
        ],
        // where: { id: Sequelize.col(ProblemStatement.user_id) },
      },
    ],
    // raw: true,
    order: Sequelize.literal('random()'),
    limit: 20,
  });
  if (randomRows) {
    res.status(200).json(randomRows);
  } else {
    res.status(400).json({
      status: 'unsuccessful',
    });
  }

  try {
  } catch (error) {}
};
