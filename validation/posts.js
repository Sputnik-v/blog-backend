import { body } from 'express-validator';

export const postValidation = [
  body('title', 'Заголовок минимум в 5 символов').isLength({min: 5}).isString(),
  body('text', 'Текст статьи должен быть минимум 20 символов').isLength({min: 20}).isString(),
  body('author', 'Укажите автора статьи').isLength({min: 5}),
  body('image', 'Неверный формат ссылки на изображение').isString(),
]
