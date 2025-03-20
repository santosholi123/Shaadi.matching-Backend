const UserMock = require("./mocks/userMock");
const bcrypt = require("bcrypt");

describe("User Model Tests", () => {
  test("Should create a new user", async () => {
    const user = await UserMock.create({
      full_name: "Jane Doe",
      email: "jane@example.com",
      password: "securepassword",
      phoneNumber: "9812345678",
      dob: "1998-05-10",
      profilePic: "jane.jpg",
      bio: "Jane's bio",
      roleId: 1,
    });

    expect(user.full_name).toBe("Jane Doe");
    expect(user.email).toBe("jane@example.com");
    expect(user.password).toBeTruthy(); // Password should exist
  });

  test("Should not allow duplicate emails", async () => {
    UserMock.$queueFailure(new Error("email must be unique"));

    await expect(
      UserMock.create({
        full_name: "Duplicate User",
        email: "jane@example.com", // Duplicate email
        password: "duplicatepassword",
        phoneNumber: "9800000000",
        dob: "1997-02-20",
        profilePic: "duplicate.jpg",
        bio: "Duplicate bio",
        roleId: 1,
      })
    ).rejects.toThrow("email must be unique");
  });

  test("Should not create a user with an invalid email", async () => {
    

    await expect(
      UserMock.create({
        full_name: "Invalid Email User",
        email: "invalidemail", // Invalid format
        password: "password",
        phoneNumber: "9800000001",
        dob: "1996-12-25",
        profilePic: "invalid.jpg",
        bio: "Invalid email test",
        roleId: 1,
      })
    ).rejects.toThrow("Validation error: must be a valid email");
  });

  test("Should hash the password before saving", async () => {
    const user = await UserMock.create({
      full_name: "Hash Test",
      email: "hash@test.com",
      password: "mypassword",
      phoneNumber: "9801234567",
      dob: "2000-01-01",
      profilePic: "hash.jpg",
      bio: "Testing bcrypt",
      roleId: 1,
    });

    const isMatch = await bcrypt.compare("mypassword", user.password);
    expect(isMatch).toBe(true);
  });
});
