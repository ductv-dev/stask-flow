import jwt from 'jsonwebtoken';

const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '30d', // Token hết hạn sau 30 ngày
  });
};

export default generateToken;