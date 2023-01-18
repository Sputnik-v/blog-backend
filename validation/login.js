import { body } from 'express-validator';

export const loginValidation = [
  body('email', 'Не верный формат почты').isEmail(),
  body('passwordHash', 'Пароль должен быть минимум 6 символов').isLength({min: 6}),
]