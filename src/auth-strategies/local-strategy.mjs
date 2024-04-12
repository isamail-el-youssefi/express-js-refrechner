import passport from "passport";
import { Strategy } from "passport-local";
import { fakeUsers } from "../utils/data.mjs";

// Strategy is a class that we need to create an instance of
passport.use(
  new Strategy((username, password, done) => {
    try {
      const findUser = fakeUsers.find((user) => user.name === username);
      if (!findUser) throw new Error("User not found");
      if (findUser.password !== password) throw new Error("Wrong credentials");
      return done(null, findUser);
    } catch (err) {
        // Error object bz it contains 2 errors from the try part
        done(err, false);
    }
  })
);
