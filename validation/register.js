import { body } from 'express-validator';

export const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('passwordHash', 'Пароль должен быть минимум 6 символов').isLength({min: 6}),
  body('fullName', 'Ваше имя должно быть минимум из 5 символов').isLength({min: 5}),
  body('avatar', 'Не является ссылкой на ваше фото').optional().isURL()
]