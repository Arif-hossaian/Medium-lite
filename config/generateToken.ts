import JWT from 'jsonwebtoken';

export const generateActiveToken = (payload: object) => {
  return JWT.sign(payload, `${process.env.ACTIVE_TOKEN_SECRET}`, {
    expiresIn: '5m',
  });
};

export const generateAccessToken = (payload: object) => {
  return JWT.sign(payload, `${process.env.ACCESS_TOKEN_SECRET}`, {
    expiresIn: '15m',
  });
};

export const generateRefreshToken = (payload: object) => {
  return JWT.sign(payload, `${process.env.REFRESH_TOKEN_SECRET}`, {
    expiresIn: '30d',
  });
};
