require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
//security packages
const helmet = require('helmet')
const cors = require('cors')
const rateLimiter = require('express-rate-limit')
const xss = require('xss-clean')
//authentication middleware
const authenticateUser = require('./middleware/authentication')
//router
const authRoute = require('./routes/auth')
const jobRoute = require('./routes/jobs')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

//connect to db
const connectDb = require('./db/connect')

app.set('trust proxy', 1)
app.use(rateLimiter({
  windowMs:15*60*1000, //15 minutes
  max:100 //limit each ip to 100 requests per windowMs
}))
app.use(cors())
app.use(helmet())
app.use(xss())
app.use(express.json());
// extra packages

// routes
// app.get('/', (req, res) => {
//   res.send('jobs api');
// });

app.use('/api/v1/auth', authRoute)
app.use('/api/v1/jobs', authenticateUser, jobRoute)
app.use('/api/v1/jobs/:id', jobRoute)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
