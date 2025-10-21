import Recipe from "./models/recipe.model";
import User from "./models/user.model";
import bcrypt from "bcryptjs";


async function setDefaultPasswords() {
  try {

    const defaultPassword = 'ChangeMe123!'; // temporary password
    const saltRounds = 10;

    const users = await User.find();

    for (const user of users) {
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(defaultPassword, salt);

      user.password = hashedPassword;
      await user.save();

      console.log(`Password set for user ${user._id}`);
    }

    console.log('All users updated successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

export default setDefaultPasswords;