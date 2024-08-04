import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRoutes from './route/auth.js';
import blogPostRoutes from './route/blogPosts.js'

const app = express();

const corsOptions = {
    origin: 'http://localhost:3001',  
    optionsSuccessStatus: 200  
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/posts', blogPostRoutes);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


app.get('/', (req, res) => {
    res.send('welcome');
})