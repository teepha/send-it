module.exports = {
  development: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  test: {
    DATABASE_URL: process.env.TEST_DATABASE_URL,
  },
  production: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
};
