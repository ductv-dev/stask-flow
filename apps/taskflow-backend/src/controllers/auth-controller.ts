import { Request, Response } from 'express';
import User from '../models/user';
import generateToken from '../utils/generate-token';

// @desc    Đăng ký tài khoản mới
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, password } = req.body;

    // 1. Kiểm tra xem người dùng đã tồn tại chưa
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: 'Email này đã được sử dụng!' });
      return;
    }

    // 2. Tạo User mới
    // Lưu ý: Password sẽ được tự động Hash nhờ cái Middleware trong Model User
    const user = await User.create({
      fullName,
      email,
      password,
    });

    // 3. Trả về dữ liệu cho Frontend (kèm theo Token)
    if (user) {
      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
        token: generateToken(user._id as unknown as string),
      });
    } else {
      res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

   
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
        token: generateToken(user._id as unknown as string), 
      });
    } else {
      res.status(401).json({ message: 'Email hoặc mật khẩu không đúng!' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  const user = req.user;
  if (user) {
    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
    });
  } else {
    res.status(404).json({ message: 'Không tìm thấy người dùng' });
  }
};