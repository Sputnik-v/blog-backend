import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

export const updateUser = async (req, res) => {
  try {

    const {_id} = req.body;

  await UserModel.updateOne({
    _id: _id,
  }, {
    avatar: req.body.avatar,
    email: req.body.email,
    fullName: req.body.fullName
  });

  res.json({
    message: 'Вы обновили пользователя'
  })

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить пользователя'
    })
  }
}

export const register = async (req, res) => {

  try {
    const pass = req.body.passwordHash;
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(pass, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatar: req.body.avatar,
      passwordHash: password
    });

    const user = await doc.save();
    const {passwordHash, ...userData} = user._doc

    const token = jwt.sign({
      _id: user.id
    },'pegassecretkey', {
      expiresIn: '30d'
    })

    res.json({
      ...userData, token
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось зарегистрироваться'
    });
  }

}

export const login = async (req, res) => {
  try {

    const user = await UserModel.findOne({email: req.body.email});

    if(!user) {
      return res.status(404).json({
        message: 'Такого пользователя не существует'
      })
    }

    const isValidPass = await bcrypt.compare(req.body.passwordHash, user._doc.passwordHash);
    if (!isValidPass) {
      return res.status(400).json({
        message: 'Неверный логин или пароль'
      })
    }

    const token = jwt.sign({
      _id: user.id
    },'pegassecretkey', {
      expiresIn: '30d'
    })

    const {passwordHash, ...userData} = user._doc
    res.json({
      ...userData, token
    });

  } catch (err) {
    res.status(500).json({
      message: 'Не удалось авторизоваться'
    });
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: 'Такого пользователя нет'
      })
    }
    const {passwordHash, ...userData} = user._doc;
    res.json(userData);

  } catch (err) {
    res.status(500).json({
      message: 'Что-то пошло не так'
    });
  }
}

export const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await UserModel.findById(userId);

    res.json({
      name: user.fullName,
      email: user.email,
      avatar: user.avatar,
      createAccount: user.createdAt,
      updateAccount: user.updatedAt
    })



  } catch (error) {
    res.status(500).json({
      message: 'Что-то пошло не так'
    });
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users)
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось получить пользователей'
    })
  }
}