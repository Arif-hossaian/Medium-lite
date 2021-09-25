import { Request, Response } from 'express';
import Users from '../models/userModel';
import bcrypt from 'bcrypt';
import JWT from "jsonwebtoken"
import {
  generateAccessToken,
  generateActiveToken,
  generateRefreshToken,
} from '../config/generateToken';
// import sendMail from '../config/sendMail';
// import { validateEmail } from '../middleware/valid';
import { IDecodedToken, IUser } from '../config/interface';

const CLIENT_URL = `${process.env.BASE_URL}`;

export const authController = {
  register: async (req: Request, res: Response) => {
    try {
      const { name, account, password } = req.body;
      const user = await Users.findOne({ account });
      if (user)
        return res
          .status(400)
          .json({ msg: 'Email or Phone number already exists.' });
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = await Users.create({
        name,
        account,
        password: passwordHash,
      });
      const active_token = generateActiveToken({ newUser });

      // const url = `${CLIENT_URL}/active/${active_token}`;
      // if (validateEmail(account)) {
      //   sendMail(account, url, 'Verify your email address');
      //   return res.json({ msg: 'Success! Please check your email.' });
      // }
      res.json({
        status: 'OK',
        msg: 'Register successfully.',
        // data: newUser,
        // active_token,
      });
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { account, password } = req.body;
      const user = await Users.findOne({ account });
      if (!user)
        return res.status(400).json({ msg: 'This account does not exits.' });

      // if user exists
      loginUser(user, password, res);
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },

  logout: async (req: Request, res: Response) => {
    try {
      res.clearCookie('refreshtoken', { path: `/api/refresh_token` });
      return res.json({ msg: 'Logged out!' });
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },

  refreshToken: async (req: Request, res: Response) => {
    try {
      const rf_token = req.cookies.refreshtoken;      
      if (!rf_token) return res.status(400).json({ msg: 'Please login now!' });

      const decoded = <IDecodedToken>(
        JWT.verify(rf_token, `${process.env.REFRESH_TOKEN_SECRET}`)
      );
      if (!decoded.id)
        return res.status(400).json({ msg: 'Please login now!' });

      const user = await Users.findById(decoded.id).select('-password');
      if (!user)
        return res.status(400).json({ msg: 'This account does not exist.' });

      const access_token = generateAccessToken({ id: user._id });

      res.json({ access_token });
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },
};

const loginUser = async (user: IUser, password: string, res: Response) => {
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: 'Password is incorrect.' });

  const access_token = generateAccessToken({ id: user._id });
  const refresh_token = generateRefreshToken({ id: user._id });

  res.cookie('refreshtoken', refresh_token, {
    httpOnly: true,
    path: `/api/refresh_token`,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
  });

  res.json({
    msg: 'Login Success!',
    access_token,
    user: { ...user._doc, password: '' },
  });
};
