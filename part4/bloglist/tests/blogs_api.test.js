const { test, describe, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const helper = require("./test_helper");

const api = supertest(app);

describe("when there is intially some blogs saved", () => {
  beforeEach(async () => {
    await helper.setupInitialUserAndBlogs();
  });

  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test("all blogs have an id property", async () => {
    const response = await api.get("/api/blogs");

    response.body.forEach((blog) => assert("id" in blog));
  });

  describe("viewing a specific blog", () => {
    test("succeeds with a valid id", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToView = blogsAtStart[0];

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(resultBlog.body.title, blogToView.title);
    });

    test("fails with status code 404 if blog does not exist", async () => {
      const nonExistingId = await helper.nonExistingId();

      await api.get(`/api/blogs/${nonExistingId}`).expect(404);
    });

    test("fails with status code 400 with invalid id", async () => {
      const invalidId = "obviouslywrongid";

      await api.get(`/api/blogs/${invalidId}`).expect(400);
    });
  });

  describe("addition of a new blog", () => {
    test("without authorization fails with status code 401", async () => {
      const newBlog = {
        url: "thenewblog.com",
        title: "The New Blog",
        author: "Newer McNewerson",
        likes: 15,
      };

      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(401)
        .expect("Content-Type", /application\/json/);
    });

    describe("with authorization", () => {
      test("succeeds with valid data", async () => {
        const newBlog = {
          url: "https://newblog.com/",
          title: "The New Blog",
          author: "Newer McNewerson",
          likes: 15,
        };

        await api
          .post("/api/blogs")
          .set("Authorization", await helper.getInitialUserBearerToken())
          .send(newBlog)
          .expect(201)
          .expect("Content-Type", /application\/json/);

        const blogsAtEnd = await helper.blogsInDb();
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

        const titles = blogsAtEnd.map((b) => b.title);
        assert(titles.includes(newBlog.title));
      });

      test("with no likes property defaults to 0", async () => {
        const blog = {
          title: "Default to Zero",
          author: "Zero",
          url: "https://likesdefaultstozero.com/",
        };

        const response = await api
          .post("/api/blogs")
          .set("Authorization", await helper.getInitialUserBearerToken())
          .send(blog);

        assert.strictEqual(response.body.likes, 0);
      });

      test("fails with status code 400 when required props are missing", async () => {
        const blog = {
          author: "Nourl Notitle",
          likes: 5,
        };

        await api
          .post("/api/blogs")
          .set("Authorization", await helper.getInitialUserBearerToken())
          .send(blog)
          .expect(400);
      });
    });
  });

  describe("deletion of a blog", () => {
    test("without authorization fails with status code 401", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(401)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
    });

    describe("with authorization", () => {
      test("succeeds with status code 204 if id is valid", async () => {
        const blogsAtStart = await helper.blogsInDb();
        const blogToDelete = blogsAtStart[0];

        await api
          .delete(`/api/blogs/${blogToDelete.id}`)
          .set("Authorization", await helper.getInitialUserBearerToken())
          .expect(204);

        const blogsAtEnd = await helper.blogsInDb();
        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);

        const titles = blogsAtEnd.map((b) => b.title);
        assert(!titles.includes(blogToDelete.title));
      });

      test("fails with status code 404 if blog does not exist", async () => {
        const nonExistingId = await helper.nonExistingId();

        const response = await api
          .delete(`/api/blogs/${nonExistingId}`)
          .set("Authorization", await helper.getInitialUserBearerToken())
          .expect(404);

        assert.match(response.body.error, /blog not found/);

        const blogsAtEnd = await helper.blogsInDb();
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
      });

      test("fails with status code 400 if id is invalid", async () => {
        const invalidId = "obviouslywrongid";

        await api
          .delete(`/api/blogs/${invalidId}`)
          .set("Authorization", await helper.getInitialUserBearerToken())
          .expect(400);

        const blogsAtEnd = await helper.blogsInDb();
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
      });

      test("fails with status code 401 if user is invalid", async () => {
        const blogsAtStart = await helper.blogsInDb();
        const blogToDelete = blogsAtStart[0];

        const response = await api
          .delete(`/api/blogs/${blogToDelete.id}`)
          .set("Authorization", await helper.getInvalidUserBearerToken())
          .expect(401)
          .expect("Content-Type", /application\/json/);

        const blogsAtEnd = await helper.blogsInDb();
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);

        assert.match(response.body.error, /invalid user/);
      });
    });
  });

  describe("updating a blog", () => {
    test("succeeds if id is valid", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];
      const updatedBlogData = {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 1,
      };

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlogData)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      const updatedBlog = blogsAtEnd.find((b) => b.id === blogToUpdate.id);
      assert.deepStrictEqual(updatedBlog, updatedBlogData);
    });

    test("fails with status code 404 if blog does not exist", async () => {
      const nonExistingId = await helper.nonExistingId();

      const response = await api
        .put(`/api/blogs/${nonExistingId}`)
        .send({})
        .expect(404);

      assert.match(response.body.error, /blog not found/);
    });

    test("fails with status code 400 if id is invalid", async () => {
      const invalidId = "obviouslywrongid";

      await api.put(`/api/blogs/${invalidId}`).send({}).expect(400);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
