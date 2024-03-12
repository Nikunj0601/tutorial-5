const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

let users = [
  {
    email: "nikunj@email.com",
    firstName: "Nikunj",
    id: "5abf6783",
  },
  {
    email: "hudka@email.com",
    firstName: "Hudka",
    id: "5abf674563",
  },
];

const generateUserId = () => {
  const alphanumeric = "abcdefghijklmnopqrstuvwxyz0123456789";
  let userId = "";
  for (let i = 0; i < 8; i++) {
    userId += alphanumeric.charAt(
      Math.floor(Math.random() * alphanumeric.length)
    );
  }
  return userId;
};

app.get("/users", (req, res) => {
  res.json({
    message: "Users retrieved",
    success: true,
    users: users,
  });
});

app.post("/add", (req, res) => {
  const user = req.body;
  if (!user || !user.email || !user.firstName) {
    return res.status(400).json({
      message: "Bad Request: Please provide valid email and firstName",
      success: false,
    });
  }
  user.id = generateUserId();
  users.push(user);
  res.json({
    message: "User added",
    success: true,
  });
});

app.put("/update/:id", (req, res) => {
  const userId = req.params.id;
  const { email, firstName } = req.body;
  const userIndex = users.findIndex((user) => user.id === userId);
  if (userIndex !== -1) {
    users[userIndex].email = email || users[userIndex].email;
    users[userIndex].firstName = firstName || users[userIndex].firstName;
    res.json({
      message: "User updated",
      success: true,
    });
  } else {
    res.status(404).json({
      message: "User not found",
      success: false,
    });
  }
});

app.get("/user/:id", (req, res) => {
  const userId = req.params.id;
  const user = users.find((user) => user.id === userId);
  if (user) {
    res.json({
      success: true,
      user: user,
    });
  } else {
    res.status(404).json({
      message: "User not found",
      success: false,
    });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    success: false,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
