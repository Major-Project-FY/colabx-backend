// importing models
import { Op } from 'sequelize';
import { Skill } from '../models/skills.js';

// API for adding skill in database
export const addSkill = async (req, res, next) => {
  const newSkill = new Skill({
    skill: req.body.skill,
  });
  newSkill
    .save()
    .then(() => {
      res.status(200).json({
        status: 'successfull',
      });
    })
    .catch((error) => {
      res.status(400).json({
        ststus: 'unsuccessful',
      });
    });
};

// API for querying familiar skills
export const querySkills = async (req, res, next) => {
  const { q } = req.query;
  const filteredSkills = await Skill.findAll({
    attributes: [
      ['id', 'skillID'],
      ['skill', 'skill'],
    ],
    where: {
      skill: { [Op.iLike]: `%${q}%` },
    },
  });
  res.status(200).json(filteredSkills);
  try {
  } catch (error) {}
};
