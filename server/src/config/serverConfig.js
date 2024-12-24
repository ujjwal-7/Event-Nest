const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    DB_HOST: process.env.DB_HOST,
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
    PAYPAL_SECRET: process.env.PAYPAL_SECRET,
    PAYPAL_BASE_URL: process.env.PAYPAL_BASE_URL,
    BUCKET_REGION: process.env.BUCKET_REGION,
    BUCKET_NAME: process.env.BUCKET_NAME,
    EMAIL: process.env.EMAIL,
    PASSWORD: process.env.PASSWORD,
    CLOUDFRONT_DISTRIBUTION: process.env.CLOUDFRONT_DISTRIBUTION,
    CLOUDFRONT_DISTRIBUTION_ID: process.env.CLOUDFRONT_DISTRIBUTION_ID
};



