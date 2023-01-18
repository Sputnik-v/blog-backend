import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';

import { registerValidation } from "./validation/register.js";
import checkAuth from './utils/checkAuth.js';
import { getMe, login, register, getUser, getAllUsers, updateUser } from "./controllers/UserControllers.js";
import { createPost, deleteOnePost, getAllPosts, getOnePost, updateOnePost } from "./controllers/PostControllers.js";
import { loginValidation } from "./validation/login.js";
import { postValidation } from "./validation/posts.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";
import { createComment, getAllComments, getComments } from './controllers/CommentController.js';


//mongodb+srv://pegas007:CGez8Q4p@pegascluster.5mxspgp.mongodb.net/socium?retryWrites=true&w=majority
mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('DB connect')
  })
  .catch((err) => {
    console.log('No connect ', err)
  })

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));              //при запросе на upload/...
                                                                 //проверять статичные файлы в папке uploads Пример: картинка со своим url upload/ins.png
app.post('/you', checkAuth, getMe);

app.get('/users', getAllUsers);

app.get('/users/:id', getUser);

app.post('/login', loginValidation, handleValidationErrors, login);

app.post('/register', registerValidation, handleValidationErrors, register);

app.post('/post', checkAuth, postValidation, handleValidationErrors, createPost);

app.get('/post', getAllPosts);

app.get('/post/:id', getOnePost);

app.delete('/post/:id', deleteOnePost);

app.patch('/post/:id', checkAuth, postValidation, handleValidationErrors, updateOnePost);

app.patch('/you/update', checkAuth, handleValidationErrors, updateUser);

app.post('/comment', checkAuth, createComment);

app.get('/comment/:id', getComments);

app.get('/comments', getAllComments);

app.post("/upload", checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `http://localhost:3001/uploads/${req.file.originalname}`,               //Загружаем под оригинальным названием

  })
});

app.listen(process.env.PORT || 3001, () => {
  console.log('server on http://localhost:3001');
});

//mongodb+srv://pegas007:<password>@pegascluster.5mxspgp.mongodb.net/?retryWrites=true&w=majority