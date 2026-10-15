const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const dialect = process.env.DB_DIALECT || "postgres";
const useDatabaseUrl = Boolean(process.env.DATABASE_URL);
const sslEnabled = String(process.env.DB_SSL || "").toLowerCase() === "true";

const baseConfig = {
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "tradingDB",
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 5432),
  dialect,
  logging: process.env.DB_LOGGING === "true" ? console.log : false,
};

if (sslEnabled && dialect === "postgres") {
  baseConfig.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };
}

const config = useDatabaseUrl
  ? {
      ...baseConfig,
      use_env_variable: "DATABASE_URL",
    }
  : baseConfig;

module.exports = {
  development: config,
  test: config,
  production: config,
};
