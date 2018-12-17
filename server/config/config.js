module.exports = {
  development: {
    DATABASE_URL: 'postgresql://postgres:password@localhost:5432/parcels_db',
  },
  test: {
    DATABASE_URL: 'postgresql://postgres:password@localhost:5432/parcels_db_test',
  },
  production: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
};
