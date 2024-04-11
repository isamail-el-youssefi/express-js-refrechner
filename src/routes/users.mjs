import { Router } from "express";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { fakeUsers } from "../utils/data.mjs";
import {
  checkSchema,
  matchedData,
  query,
  validationResult,
} from "express-validator";

const router = Router();

//!! Post Request
router.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  (req, res) => {
    const result = validationResult(req);
    console.log(result);
    if (!result.isEmpty())
      return res.status(400).send(result.array().map((err) => err.msg));

    const validatedData = matchedData(req);

    //const { body } = req;
    const newUser = {
      id: Date.now(),
      ...validatedData,
    };
    fakeUsers.push(newUser);
    return res.send(fakeUsers);
  }
);

//!! Get single user
//!! Route Params  localhost:3000/users/:id
router.get("/api/users/:id", (req, res) => {
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

//!! Query params localhost:3000/users?filter=value&value=value
router.get(
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
    if (!result.isEmpty())
      return res.status(400).send(result.array().map((err) => err.msg));

    const { filter, value } = req.query;

    // when filter and value are provided
    if (filter && value)
      return res.send(fakeUsers.filter((user) => user[filter].includes(value)));
    //localhost:3000/api/users?filter=name&value=so ===>>>  [{"id":1,"name":"soth","car":"fiord"},{"id":4,"name":"sof1","car":"rav4"}]

    // if filter and value are not provided
    res.send(fakeUsers);
  }
);

//!! Put request
router.put("/api/users/:id", (req, res) => {
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

//!! Put request
router.patch("/api/users/:id", (req, res) => {
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

//!! Delete request
router.delete("/api/users/:id", (req, res) => {
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

export default router;
