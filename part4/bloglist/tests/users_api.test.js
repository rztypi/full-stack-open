const { test, describe, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const helper = require("./test_helper");

const api = supertest(app);

describe("when there is intially one user in db", () => {
  beforeEach(async () => {
    await helper.setupInitialUser();
  });

  test("users are returned", async () => {
    const response = await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.length, 1);
  });

  describe("user creation", () => {
    test("succeeds with status code 201 with valid data", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: "rztypi",
        name: "Rezz Tony C. Piraman",
        password: "qwerty123456",
      };

      await api
        .post("/api/users")
        .send(newUser)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

      const usernames = usersAtEnd.map((u) => u.username);
      assert(usernames.includes(newUser.username));
    });

    test("fails with status code 400 when username exists", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: helper.initialUser.username,
        name: "Test",
        password: "test123",
      };

      const response = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      assert(response.body.error.includes("expected `username` to be unique"));

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test("fails with status code 400 when username is invalid", async () => {
      const usersAtStart = await helper.usersInDb();

      const userWithNoUsername = {
        name: "No Username",
        password: "nousername",
      };

      let response = await api
        .post("/api/users")
        .send(userWithNoUsername)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      assert(response.body.error.includes("User validation failed: username"));

      let usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);

      const userWithShortUsername = {
        username: "s",
        name: "Short User",
        password: "shortusername",
      };

      response = await api
        .post("/api/users")
        .send(userWithShortUsername)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      assert(response.body.error.includes("User validation failed: username"));

      usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test("fails with status code 400 when password is invalid", async () => {
      const usersAtStart = await helper.usersInDb();

      const userWithNoPassword = {
        username: "nopassword",
        name: "No Password",
      };

      let response = await api
        .post("/api/users")
        .send(userWithNoPassword)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      assert(
        response.body.error.includes(
          "password must be at least 3 characters long"
        )
      );

      let usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);

      const userWithShortPassword = {
        username: "shortpassword",
        name: "Short Password",
        password: "p",
      };

      response = await api
        .post("/api/users")
        .send(userWithShortPassword)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      assert(
        response.body.error.includes(
          "password must be at least 3 characters long"
        )
      );

      usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
