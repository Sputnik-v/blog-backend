import CommentModel from "../models/Comment.js";

export const createComment = async (req, res) => {
    try {
  
      const doc = new CommentModel({
        comm: req.body.comm,
        user: req.userId,
        post: req.body.id
      });
  
      const comm = await doc.save();
  
      res.json(comm)
  
    } catch (err) {
        console.log(err);
        res.status(500).json({
          message: 'Не удалось отправить коммент'
        })
    }
  }


export const getComments = async (req, res) => {
  try {

    const postId = req.params.id;

    const comments = await CommentModel.find({post: postId}).populate('user').exec();
    res.json(comments);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить комментарии'
    })
  }
}

export const getAllComments = async (req, res) => {
  try {

    const comments = await CommentModel.find().populate('user').exec();
    res.json(comments);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить все комментарии'
    })
  }
}