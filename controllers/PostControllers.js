import PostModel from '../models/Post.js';



export const createPost = async (req, res) => {
  try {

    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      author: req.body.author,
      image: req.body.image,
      user: req.userId
    });

    const post = await doc.save();

    res.json(post)

  } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось создать пост'
      })
  }
}

export const getAllPosts = async (req, res) => {
  try {

    const posts = await PostModel.find().populate('user').exec();
    res.json(posts);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи'
    })
  }
}

export const getOnePost = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsPost: 1 },
      },
      {
        returnDocument: 'after',
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Не удалось вернуть статью',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена',
          });
        }

        res.json(doc);
      },
    ).populate('user');
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const deleteOnePost = async (req, res) => {
  try {

    const postId = req.params.id;

    PostModel.findOneAndDelete({
      _id: postId,
    },(err, doc) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: 'Не удалось удалить статью'
        });
      }
      if (!doc) {
        return res.status(404).json({
          message: 'Статья не найдена'
        });
      }
      res.json({
        message: 'Статья удалена'
      });
    })

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи'
    });
  }
}

export const updateOnePost = async (req, res) => {
  try {

    const postId = req.params.id;

  await PostModel.updateOne({
    _id: postId,
  }, {
    title: req.body.title,
    text: req.body.text,
    author: req.body.author,
    image: req.body.image,
    user: req.userId
  });

  res.json({
    message: 'Вы обновили статью'
  })

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить статью'
    })
  }
}