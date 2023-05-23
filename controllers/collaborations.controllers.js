// importing modules
import { Op } from 'sequelize';

// importing databse models
import { StatementCollaborator } from '../models/statementCollaborators.js';

// API to add collaborator to a problem statement
export const addCollaboratorToStatement = async (req, res, next) => {
  const { userID } = res.locals.user;
  const { statementID } = req.body;
  const newCollaborator = new addCollaboratorToStatement({
    statement_id: statementID,
    collaborator_user_id: userID,
  });
  newCollaborator
    .save()
    .then((result) => {
      res.status(200).json({ status: 'successful' });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ status: 'unsuccessful' });
    });
  //   try {
  //   } catch (error) {
  //     res.status(500).json({ status: 'unsuccessful' });
  //   }
};

export const getAllStatementCollaborators = (req, res, next) => {
  const { statementID } = req.params;
  StatementCollaborator
    .findAndCountAll({
      attributes: [['collaborator_user_id', 'userIDs']],
      where: {
        statement_id: {
          [Op.eq]: statementID,
        },
      },
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(400).json({ status: 'unsuccessful' });
    });
  //   try {
  //   } catch (error) {
  //     res.status(500).json({ status: 'unsuccessful' });
  //   }
};
