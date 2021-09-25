import { Request, Response } from 'express';
import Users from '../models/userModel';
import bcrypt from 'bcrypt';
import { generateActiveToken } from '../config/generateToken';

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
      const newUser = { name, account, password: passwordHash };
      const active_token = generateActiveToken({ newUser });
      res.json({
        status: 'OK',
        msg: 'Register successfully.',
        data: newUser,
        active_token,
      });
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },
};
