import express from 'express';
import bodyParser from 'body-parser';
import router from './route/auth.js';

const app = express();
app.use(bodyParser.json());

app.use('/auth', router);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});