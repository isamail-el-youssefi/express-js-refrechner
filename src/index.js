import express from "express";
import userRouter from "./routes/users.mjs";
import productRouter from "./routes/product.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { fakeUsers } from "./utils/data.mjs";
import passport from "passport";
import "./auth-strategies/local-strategy.mjs";

// Instantiating express to variable app
const app = express();

// Returns middleware that only parses json and only looks at requests where the Content-Type header matches the type option.
app.use(express.json());
app.use(cookieParser("randomsecret"));
app.use(
  session({
    secret: "ismailelyoussefiblabla",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 20000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

const globalMiddleware = (req, res, next) => {
  console.log(req.method, req.path, "HI IAM MIDDLEWARE");
  next();
};
// enabling the middleware for all the routes
app.use(globalMiddleware);

app.use(userRouter);
app.use(productRouter);

const localMiddleware = (req, res, next) => {
  console.log("HI IAM LOCAL MIDDLEWARE");
  next();
};

// enabling the middleware for this route only
app.get("/", localMiddleware, (req, res) => {
  // we did take the cookie from the server responce bz the server who is creatin the cookie
  res.cookie("cookieExperimental", "hello im a cookie", {
    maxAge: 15000,
    signed: true,
  }); // this is the the route ("/") that you must visit first in order for the user to kind like authenticate have the cookies
  res.status(201).send("Hello, World!"); //sending simpple text
});

/* //!! Fake authentication to understand well the session concept
app.post("/api/auth", (req, res) => {
  const { name, password } = req.body;
  const findUser = fakeUsers.find(
    (user) => user.name === name && user.password === password
  );
  if (!findUser) return res.status(401).send({ msg: "BAD CREDENTIALS" });
  // dynamic property (user) {like mapping over all the users} after the req.session {chof modkira for better understanding}
  // req.session.user is being dynamically assigned a value during the execution of the code.
  req.session.user = findUser; // setting up the cookie //?? All the 7 users in the arraw with the right credentials can have the session inside a cookie (Authenticated) Thats why the user after req.session is a dynamic property
  return res.status(200).send({ msg: "AUTHENTICATED" });
});
//?? the server can manage not only one but many sessions and map each sessiion to diffrent users

//!! Can't access this route if not authenticated
app.get("/api/auth/status", (request, res) => {
  request.sessionStore.get(request.sessionID, (err, session) => {
    console.log(session);
  });
  return request.session.user //
    ? res.status(200).send(request.session.user) // Available for 20 seconds
    : res.status(401).send({ msg: "UNAUTHENTICATED" });
}); */

//!! Authentication with PassportJs (passing the passport callback here to invoke it when the post request is made by the user)
app.post("/api/auth", passport.authenticate("local"), (request, responce) => {
  responce.sendStatus(200);
});

//!! Can't access this route if not authenticated
app.get("/api/auth/status", (request, responce) => {
  console.log("inside auth/status");
  console.log(request.user);
  // if the user is logged in
  if (request.user) return responce.status(200).send(request.user);
  return responce.status(401).send({ msg: "UNAUTHENTICATED" });
});

//!! Logout by destroying the session
app.post("/api/auth/logout", (request, responce) => {
  // if the user not logged in
  !request.user
    ? responce.sendStatus(401)
    : request.logout((err) => {
        if (err) return responce.sendStatus(400);
        return responce.sendStatus(200);
      });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
