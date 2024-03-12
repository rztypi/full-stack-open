const _ = require("lodash");

const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (total, blog) => total + blog.likes;

  return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  let blog = _.maxBy(blogs, "likes");

  return blog === undefined
    ? null
    : { title: blog.title, author: blog.author, likes: blog.likes };
};

const mostBlogs = (blogs) => {
  const authorBlogCount = _.countBy(blogs, "author");
  const maxAuthor = _.reduce(
    authorBlogCount,
    (result, value, key) => {
      return result !== "" && authorBlogCount[result] > value ? result : key;
    },
    null
  );

  return maxAuthor === null
    ? null
    : {
        author: maxAuthor,
        blogs: authorBlogCount[maxAuthor],
      };
};

const mostLikes = (blogs) => {
  const authorLikeCount = blogs.reduce((acc, cur) => {
    acc[cur.author] = acc[cur.author] + cur.likes || cur.likes;
    return acc;
  }, {});
  const maxAuthor = _.reduce(
    authorLikeCount,
    (result, value, key) => {
      return result !== "" && authorLikeCount[result] > value ? result : key;
    },
    null
  );

  console.log(Object.keys(authorLikeCount));
  console.log(authorLikeCount, maxAuthor);

  return maxAuthor === null
    ? null
    : {
        author: maxAuthor,
        likes: authorLikeCount[maxAuthor],
      };
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
