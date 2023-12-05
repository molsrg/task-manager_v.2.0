const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const User = require('../models/User');
const Role = require('../models/Role');
const refreshToken = require('../models/refreshToken');
const {
  AccessSecret,
  RefreshSecret,
  ClientID,
  ClientSecret,
} = require('../config');

const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles,
  };
  return jwt.sign(payload, AccessSecret, { expiresIn: '7d' });
};

const generateRefreshToken = (id) => {
  const payload = { id };
  return jwt.sign(payload, RefreshSecret, { expiresIn: '7d' });
};

class authController {
  // ПРОВЕРИТЬ НАЛИЧИЕ ПОЛЕЙ password, email, user без required
  async registration(req, res) {
    try {
      const { username, email, password } = req.body;
      const candidateUsername = await User.findOne({ username });
      const candidateEmail = await User.findOne({ email });

      if (candidateUsername) {
        res
          .status(400)
          .json({ message: 'Пользователь с таким именем уже существует' });
        return;
      }

      if (candidateEmail) {
        res
          .status(400)
          .json({ message: 'Почтовый адрес уже был зарегистрирован' });
        return;
      }

      const hashPassword = bcrypt.hashSync(password, 7);
      const userRole = await Role.findOne({ value: 'USER' });

      const user = new User({
        username,
        email,
        password: hashPassword,
        roles: [userRole.value],
        createdAt: Date.now(),
        authMethod: 'Classic',
      });

      await user.save();
      const AccessToken = generateAccessToken(user._id, user.roles);
      const RefreshToken = generateRefreshToken(user._id);

      const refToken = new refreshToken({
        userId: user._id,
        token: RefreshToken,
        createdAt: new Date(Date.now()),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      await refToken.save();
      return res.json({
        message: 'Пользователь создан',
        AccessToken,
        RefreshToken,
      });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'Registration failed' });
      return;
    }
  }
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: `Почта ${email} не найдена` });
      }

      const validPassword = bcrypt.compareSync(password, user.password);

      if (!validPassword) {
        return res.status(400).json({ message: `Введен неверный пароль` });
      }

      const AccessToken = generateAccessToken(user._id, user.roles);
      const RefreshToken = generateRefreshToken(user._id);
      await refreshToken.deleteMany({
        userId: user._id,
      });
      console.log(user._id);
      const refToken = new refreshToken({
        userId: user._id,
        token: RefreshToken,
        createdAt: new Date(Date.now()),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      await refToken.save();
      return res.json({ AccessToken, RefreshToken });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'Login failed', e });
    }
  }

  async refresh(req, res) {
    try {
      const { accessToken } = req.body;
      const _id = jwt.verify(accessToken, RefreshSecret).id;
      const user = await User.findById(_id);
      console.log(user);
      if (user) {
        const refreshTokenExistanse = await refreshToken.findOne({
          userId: _id,
        });
        console.log(refreshTokenExistanse);
        if (refreshTokenExistanse) {
          const accessToken = generateAccessToken(_id, 'User');
          res.status(200).json({ message: 'Лови!', accessToken });
        } else {
          res.status(200).json({ message: 'RefreshToken не найден' });
        }
      } else {
        res.status(200).json({
          message: 'Чет пользователя такого нет, Access Token invalid',
        });
      }
    } catch (error) {
      res.status(400).json({ error });
    }
  }

  async gh_oauth(req, res) {
    try {
      const { code } = req.body;

      const tokenData = {
        client_id: ClientID,
        client_secret: ClientSecret,
        code: code,
      };
      const response = await axios.post(
        'https://github.com/login/oauth/access_token',
        tokenData,
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );
      if (!response.data.access_token) {
        console.log(response);
        return res.status(400).json({ message: 'Вход не удался' });
      }

      const userData = await axios.get('https://api.github.com/user', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + response.data.access_token,
        },
      });
      if (!userData.data.id) {
        return res
          .status(400)
          .json({ message: 'Ошибка при получении данных от GitHub' });
      }
      //проверка наличия такого-же GH_username и GHId в БД
      //пока создание, но нужно еще заставить ввести пароль
      //проверка наличия такого-же GH_username и GHId в БД
      const registeredUser = await User.find({
        GH_username: userData.data.login,
        GHId: userData.data.id,
      });
      console.log(userData.data);
      if (registeredUser.length == 1) {
        const _refreshToken = generateRefreshToken(registeredUser[0]._id);
        const refToken = new refreshToken({
          userId: registeredUser[0]._id,
          token: _refreshToken,
          createdAt: new Date(Date.now()),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        const accessToken = generateAccessToken(
          registeredUser[0]._id,
          registeredUser[0].roles
        );
        await refToken.save();
        return res.status(200).json({
          message: 'Авторизация успешна!',
          _refreshToken,
          accessToken,
        });
      } else if (registeredUser.length > 1) {
        console.log(
          'Каким-то хуем в БД оказалось 2 пользователя с одним гитхабом. Обратитесь в ТП я хуй знает.'
        );
        return res.status(400).json({ message: 'Обратитесь в ТП' });
      } else {
        const guestName =
          'Guest' + Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);

        const user = new User({
          username: guestName,
          createdAt: new Date(Date.now()),
          authMethod: 'GitHub',
          GHId: userData.data.id,
          GH_username: userData.data.login,
        });

        await user.save();
        const _refreshToken = generateRefreshToken(user._id);
        const refToken = new refreshToken({
          userId: user._id,
          token: _refreshToken,
          createdAt: new Date(Date.now()),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        const accessToken = generateAccessToken(user._id, user.roles);
        await refToken.save();
        return res.status(200).json({
          message: 'Аутентификация успешна!',
          _refreshToken,
          accessToken,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(200).json({ error });
    }
  }
}
module.exports = new authController();
