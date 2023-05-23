// importing models
import { Skill } from '../../models/skills.js';

// importing modules
import { Op } from 'sequelize';

// exporting helper function with gets skill IDs and
// returns skill names along with ID
export const getSkillsByIDs = async (skillIDs, params) => {
  try {
    if (skillIDs && skillIDs.length) {
      if (params && params.noSkillIDs) {
        const result = await Skill.findAll({
          attributes: ['skill'],
          where: {
            id: { [Op.in]: skillIDs },
          },
          raw: true,
        });
        return result.map((item) => item.skill);
      } else {
        const result = await Skill.findAll({
          attributes: [
            ['id', 'skillID'],
            ['skill', 'skill'],
          ],
          where: {
            id: { [Op.in]: skillIDs },
          },
          raw: true,
        });
        return result.map((item) => item.skill);
      }
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};
