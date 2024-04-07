import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.status(201).send("Hello, World!"); //sending simpple text
});

app.get("/api/users", (req, res) => {
  res.send([
    { id: 1, name: "soth" },
    { id: 2, name: "jack" },
  ]); // sending json object
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
