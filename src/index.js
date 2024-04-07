import express from "express";

const app = express();

const fakeUsers = [
  { id: 1, name: "soth" },
  { id: 2, name: "jack" },
];

app.get("/", (req, res) => {
  res.status(201).send("Hello, World!"); //sending simpple text
});

// all users
app.get("/api/users", (req, res) => {
  res.send(fakeUsers); // sending json object
});

app.get("/api/users/:id", (req, res) => {
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
  if (!findUser) 
  return res.status(404).send({ msg: "User not found" });
  res.send(findUser);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
