const { test, describe } = require("node:test");
const assert = require("node:assert");

const listHelper = require("../utils/list_helper");

const emptyBlog = [];
const singleBlog = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
];
const multipleBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

test("dummy returns one", () => {
  const result = listHelper.dummy();
  assert.strictEqual(result, 1);
});

describe("total likes", () => {
  test("of empty list is zero", () => {
    const result = listHelper.totalLikes(emptyBlog);
    assert.strictEqual(result, 0);
  });
  test("when list has only one blog equals the likes of that", () => {
    const result = listHelper.totalLikes(singleBlog);
    assert.strictEqual(result, 7);
  });
  test("of a bigger list is calculated right", () => {
    const result = listHelper.totalLikes(multipleBlogs);
    assert.strictEqual(result, 36);
  });
});

describe("favorite blog", () => {
  test("of empty list is null", () => {
    const result = listHelper.favoriteBlog(emptyBlog);
    assert.strictEqual(result, null);
  });

  test("of list with one blog is that blog", () => {
    const result = listHelper.favoriteBlog(singleBlog);
    const blog = {
      title: "React patterns",
      author: "Michael Chan",
      likes: 7,
    };
    assert.deepStrictEqual(result, blog);
  });

  test("of list of multiple blogs returns the correct blog", () => {
    const result = listHelper.favoriteBlog(multipleBlogs);
    const expected = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    };
    assert.deepStrictEqual(result, expected);
  });
});

describe("most blogs", () => {
  test("of empty list returns null", () => {
    const result = listHelper.mostBlogs(emptyBlog);
    assert.deepStrictEqual(result, null);
  });
  test("of list with single blog returns author with blog count of 1", () => {
    const result = listHelper.mostBlogs(singleBlog);
    const expected = {
      author: "Michael Chan",
      blogs: 1,
    };
    assert.deepStrictEqual(result, expected);
  });
  test("of list with multiples blogs returns author with max blog count", () => {
    const result = listHelper.mostBlogs(multipleBlogs);
    const expected = {
      author: "Robert C. Martin",
      blogs: 3,
    };
    assert.deepStrictEqual(result, expected);
  });
});

describe("most likes", () => {
  test("of empty list returns null", () => {
    const result = listHelper.mostLikes(emptyBlog);
    assert.deepStrictEqual(result, null);
  });
  test("of list with single blog returns author with same likes", () => {
    const result = listHelper.mostLikes(singleBlog);
    const expected = {
      author: "Michael Chan",
      likes: 7,
    };
    assert.deepStrictEqual(result, expected);
  });
  test("of list with multiples blogs returns author with max likes", () => {
    const result = listHelper.mostLikes(multipleBlogs);
    const expected = {
      author: "Edsger W. Dijkstra",
      likes: 17,
    };
    assert.deepStrictEqual(result, expected);
  });
});
