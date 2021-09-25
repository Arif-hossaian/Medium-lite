import { Request, Response, NextFunction } from 'express';

export const validRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, account, password } = req.body;
  if (!name) {
    return res.status(400).json({ msg: 'Please add your name' });
  } else if (name.length > 20) {
    return res.status(400).json({ msg: 'Your name up to 20 characters long' });
  }

  if (!account) {
    return res.status(400).json({ msg: 'Please add your email/phone' });
  } else if (!validPhone(account) && !validateEmail(account)) {
    return res
      .status(400)
      .json({ msg: 'Email or phone number format is incorrect.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ msg: 'Password must be at least 6 chars.' });
  }
  next();
};

const validPhone = (phone: string) => {
  const re = /^[+]/g;
  return re.test(phone);
};

const validateEmail = (email: string) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};