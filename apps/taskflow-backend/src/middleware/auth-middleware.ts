import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';

interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  // 1. Kiểm tra xem header có gửi Token theo chuẩn "Bearer <token>" không
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Lấy token ra (bỏ chữ 'Bearer ' đi)
      token = req.headers.authorization.split(' ')[1];

      // 2. Dịch ngược Token ra để lấy ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

      // 3. Tìm user trong DB dựa vào ID đó (trừ trường password ra)
      // Dùng 'as any' nếu TS vẫn báo lỗi, nhưng nhờ file d.ts ở Bước 1 nên sẽ ổn
      req.user = await User.findById(decoded.id).select('-password') as any;

      next(); // Cho phép đi tiếp vào Controller
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Token không hợp lệ, vui lòng đăng nhập lại!' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Không có quyền truy cập, thiếu Token!' });
  }
};