import passport from "passport";
import { Strategy } from "passport-local";
import { fakeUsers } from "../utils/data.mjs";
import { User } from "../mongoose/schema/userSchema.mjs";
// storing the user.id in the session
passport.serializeUser((user, done) => {
  console.log("inside serializeUser");
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
  console.log("inside deserializeUser");
  console.log(`deserializeUser id ${id}`);
  try {
    const findUser = await User.findById(id);
    if (!findUser) throw new Error("User not found");
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

// Strategy is a class that we need to create an instance of
export default passport.use(
  new Strategy(async (username, password, done) => {
    console.log(`password: ${password}`);
    console.log(`username: ${username}`);
    try {
      const findUser = await User.findOne({ username });
      if (!findUser) throw new Error("User not found");
      if (findUser.password !== password) throw new Error("Bad credentials");
      done(null, findUser);
    } catch (err) {
      done(err, null);
    }
  })
);
