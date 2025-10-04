require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routers/userRouter');
const materialRouter = require('./routers/materialRouter')
const courseRouter = require('./routers/courseRouter')
const enrollmentRouter = require('./routers/enrollmentRouter')
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yml');
const OpenApiValidator = require('express-openapi-validator')

const app = express();
const PORT = 8080;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());

app.use((req, _res, next) => {
  console.log('Incoming request:', req.method, req.path);
  next();
})

app.use(cors({
  origin: process.env.ORIGIN_URL,
  credentials: true,
}));

app.use('/api/users', userRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/materials', materialRouter)
app.use('/api/courses', courseRouter)
app.use('/api/enrollment', enrollmentRouter)
app.use('/uploads', express.static('uploads'));


mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
  });