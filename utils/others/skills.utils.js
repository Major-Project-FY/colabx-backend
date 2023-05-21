// importing models
import { Skill } from '../../models/skills.js';

// importing modules
import { Op } from 'sequelize';

// exporting helper function with gets skill IDs and 
// returns skill names along with ID
export const getSkillsByIDs = async (skillIDs) => {
  try {
    const result = await Skill.findAll({
      attributes: [
        ['id', 'skillID'],
        ['skill', 'skill'],
      ],
      where: {
        id: { [Op.in]: skillIDs },
      },
    });
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};
