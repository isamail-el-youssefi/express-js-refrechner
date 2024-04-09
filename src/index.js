import express from "express";
import { query, validationResult } from "express-validator";

// middleware
const app = express();

app.use(express.json());

const globalMiddleware = (req, res, next) => {
  console.log(req.method, req.path, "HI IAM MIDDLEWARE");
  next();
};

const localMiddleware = (req, res, next) => {
  console.log("HI IAM LOCAL MIDDLEWARE");
  next();
};

// enabling the middleware for all the routes
app.use(globalMiddleware);

const fakeUsers = [
  { id: 1, name: "soth", car: "fiord" },
  { id: 2, name: "smail", car: "toyota" },
  { id: 3, name: "hamza", car: "honda" },
  { id: 4, name: "sof1", car: "rav4" },
  { id: 5, name: "mourad", car: "dacia" },
  { id: 6, name: "marra", car: "renault" },
  { id: 7, name: "imad", car: "rand rover" },
];

// enabling the middleware for this route only
app.get("/", localMiddleware, (req, res) => {
  res.status(201).send("Hello, World!"); //sending simpple text
});

//?? Route Params  localhost:3000/users/:id
app.get("/api/users/:id", (req, res) => {
  console.log(req.params); // {id: "1"}
  console.log(req.params.id); // 1
  // 2 methods to transfer the parameter from string to number
  const parsedUserIdMethode1 = req.params.id * 1;
  const parsedUserIdMethode2 = parseInt(req.params.id);

  // if the parameter given not a number
  if (isNaN(parsedUserIdMethode1)) {
    return res.status(400).send({ msg: "Invalid user id" });
  }

  // find the user by id with array method (find)
  const findUser = fakeUsers.find((user) => user.id === parsedUserIdMethode1);

  // if the parameter given (id) is indeed a number but does not exist in the array
  if (!findUser) return res.status(404).send({ msg: "User not found" });
  res.send(findUser);
});

//?? Query params localhost:3000/users?filter=value&value=value
app.get(
  "/api/users",
  query("filter")
    .isString()
    .withMessage("must be a string")
    .notEmpty()
    .withMessage("must not be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("must be at least 3 max 10"),
  (req, res) => {
    console.log(req.query);

    const result = validationResult(req);
    console.log(result);

    const { filter, value } = req.query;

    // when filter and value are provided
    if (filter && value)
      return res.send(fakeUsers.filter((user) => user[filter].includes(value)));
    //localhost:3000/api/users?filter=name&value=so ===>>>  [{"id":1,"name":"soth","car":"fiord"},{"id":4,"name":"sof1","car":"rav4"}]

    // if filter and value are not provided
    res.send(fakeUsers);
  }
);

//?? Post Request
app.post("/api/users", (req, res) => {
  console.log(req.body);
  const { body } = req;
  const newUser = {
    id: Date.now(),
    ...body,
  };
  fakeUsers.push(newUser);
  return res.send(fakeUsers);
});

//?? Put request
app.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const { body } = req;

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.status(400).send({ msg: "Invalid id" });

  const findUserIndex = fakeUsers.findIndex((user) => user.id === parsedId);
  console.log(findUserIndex);
  if (findUserIndex === -1) {
    return res.status(404).send({ msg: "User not found" });
  }

  fakeUsers[findUserIndex] = { id: parsedId, ...body };
  res.send(fakeUsers);
});

//?? Put request
app.patch("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const { body } = req;

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.status(400).send({ msg: "Invalid id" });

  const findUserIndex = fakeUsers.findIndex((user) => user.id === parsedId);
  console.log(findUserIndex);
  if (findUserIndex === -1) {
    return res.status(404).send({ msg: "User not found" });
  }

  fakeUsers[findUserIndex] = { ...fakeUsers[findUserIndex], ...body };
  res.send(fakeUsers);
});

//?? Delete request
app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const parsedId = id * 1;
  console.log(parsedId);

  if (isNaN(parsedId)) {
    return res.status(400).send({ msg: "Invalid id" });
  }

  const findUserIndex = fakeUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) {
    return res.status(404).send({ msg: "User not found" });
  }

  fakeUsers.splice(findUserIndex, 1);

  return res.send(fakeUsers);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
