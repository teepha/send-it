module.exports = {
  development: {
    DATABASE_URL: 'postgres://root:password@localhost:5432/parcels_db',
  },
  test: {
    DATABASE_URL: 'postgres://root:password@localhost:5432/parcels_db_test',
  },
  production: {
    DATABASE_URL: process.env.PROD_DATABASE_URL,
  },
};
