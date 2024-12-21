const { serverConfig, logger } = require("./config/index");
const express = require("express");
const morgan = require("morgan");
const apiRoutes = require("./routes/index");
const db = require("./models/index");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require('express-rate-limit');
const {scheduleCancelStaleOrders} = require("./utils/cronJobs");

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const morganFormat = ':method :url :status :response-time ms';

app.use(morgan(morganFormat, {
  stream: {
    write: (message) => {
      const logObject = {
        method: message.split(' ')[0],
        url: message.split(' ')[1],
        status: message.split(' ')[2],
        responseTime: message.split(' ')[3],

      };
      logger.info(JSON.stringify(logObject));
    }
  }
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);

app.use("/api", apiRoutes);

app.get("/health-check", async (req, res) => {
  res.json({message: "Service is healthy."});
});

app.listen(serverConfig.PORT, async () => {

    logger.info(`Server started at PORT ${serverConfig.PORT}`);
    db.sequelize.authenticate().then(() => {
      logger.info('Database connection has been established successfully.');
    }).catch(err => {
      logger.info('Unable to connect to the database:', err);
    });

    scheduleCancelStaleOrders();
});
