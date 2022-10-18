// importing models
import { User } from "../models/user.js";
console.log("user", User);

export const userSignup = async (req, res, next) => {
  console.log("inside user signup");
  const jane = await User.create({ firstName: "Jane", lastName: "Doe" });
  console.log("Jane's auto-generated ID:", jane.id);
  res.status(200).json(jane).send();
};
