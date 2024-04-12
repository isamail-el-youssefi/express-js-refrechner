import passport from "passport";
import { Strategy } from "passport-local";
import { fakeUsers } from "../utils/data.mjs";

// storing the user.id in the session
passport.serializeUser((user, done) => {
  done(null, user.id);
  //
});



// Strategy is a class that we need to create an instance of
export default passport.use(
  new Strategy((username, password, done) => {
    console.log(`password: ${password}`);
    console.log(`username: ${username}`);
    try {
      const findUser = fakeUsers.find((user) => user.username === username);
      if (!findUser) throw new Error("User not found");
      if (findUser.password !== password) throw new Error("Wrong credentials");
      done(null, findUser);
    } catch (err) {
      // Error object bz it contains 2 errors from the try part
      done(err, null);
    }
  })
);