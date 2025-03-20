const SequelizeMock = require("sequelize-mock");
const bcrypt = require("bcrypt");

const dbMock = new SequelizeMock();
const UserMock = dbMock.define("User", {
  full_name: "Jane Doe",
  email: "jane@example.com",
  password: bcrypt.hashSync("securepassword", 10),
  phoneNumber: "9812345678",
  dob: "1998-05-10",
  profilePic: "jane.jpg",
  bio: "Jane's bio",
  roleId: 1,
});

// ✅ Store Created Users in Memory to Enforce Unique Email
const createdUsers = [];

UserMock.create = jest.fn(async (data) => {
  // Fake Email Validation
  if (!data.email.includes("@")) {
    throw new Error("Validation error: must be a valid email");
  }

  // ✅ Check for Duplicate Email
  if (createdUsers.some((user) => user.email === data.email)) {
    throw new Error("email must be unique");
  }

  // ✅ Fake Password Hashing
  data.password = await bcrypt.hash(data.password, 10);

  createdUsers.push(data); // Store created user
  return UserMock.build(data);
});


module.exports = UserMock;8
