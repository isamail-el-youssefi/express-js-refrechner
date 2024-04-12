import { Router } from "express";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import {
  checkSchema,
  matchedData,
  query,
  validationResult,
} from "express-validator";
import { User } from "../mongoose/schema/userSchema.mjs";

const router = Router();

//!! Post Request (create user) || User.create(body)
router.post(
  "/users",
  checkSchema(createUserValidationSchema),
  async (req, res) => {
    //validating the request with validationResult() fromexpress-validator package
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const data = matchedData(req); //we use this one instead of req.body because it will return only the data that matches the schema
    const { body } = req;
    const { username } = req.body;

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).send({ error: "User already exists" });
      }

      // If username is unique, create the user
      const newUser = await User.create(data);
      return res.status(201).send(newUser);
    } catch (err) {
      console.error(err);
      return res.status(500).send("Server Error");
    }
  }
);

//!! Get Request (All users) || User.find({})
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).send(users);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});

//!! Get Request (User by id) || User.findById(id)
router.get("/users/:id", async (req, res) => {
  //validating the request with validationResult() fromexpress-validator package
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  /*   if (!id) {
      return res.status(400).send({ error: "User id is required" });
    } */

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).send({ error: "User not found" });
    return res.status(200).send(user);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});

//!! Put Request (Update user) || User
router.put("/users/:id", async (req, res) => {
  //validating the request with validationResult() fromexpress-validator package
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { body } = req;
  const { username } = req.body;
  const { id } = req.params;

  try {
    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).send({ error: "Username already exists" });
    }

    // If username is unique, update the user
    const updatedUser = await User.findByIdAndUpdate(id, body, { new: true });
    if (!updatedUser) {
      return res.status(404).send({ error: "User not found" });
    }
    return res.status(200).send(updatedUser);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});

export default router;
