import { Request, Response } from "express";
import User from "../models/user";
import generateToken from "../utils/generate-token";
import { OAuth2Client } from "google-auth-library";

/** Helper: trả lỗi thống nhất */
function sendError(res: Response, status: number, message: string, code?: string) {
  return res.status(status).json({ message, code });
}

// @desc    Đăng ký tài khoản mới
// @route   POST /api/auth/register
// @access  Public


export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    let { fullName, email, password } = req.body as {
      fullName?: string;
      email?: string;
      password?: string;
    };

    // Basic validation (chưa dùng zod theo yêu cầu)
    fullName = (fullName ?? "").trim();
    email = (email ?? "").trim().toLowerCase();
    password = String(password ?? "");

    if (!fullName || !email || !password) {
      sendError(res, 400, "Vui lòng nhập đầy đủ thông tin.", "VALIDATION_ERROR");
      return;
    }

    // Có thể thêm tối thiểu mật khẩu tạm thời (không cần zod)
    if (password.length < 6) {
      sendError(res, 400, "Mật khẩu phải có ít nhất 6 ký tự.", "WEAK_PASSWORD");
      return;
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      // ✅ REST đúng nghĩa hơn cho trùng dữ liệu
      sendError(res, 409, "Email này đã được sử dụng!", "EMAIL_TAKEN");
      return;
    }

    const user = await User.create({ fullName, email, password });

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(String(user._id)),
    });
  } catch (error) {
    sendError(res, 500, (error as Error).message || "Server error", "SERVER_ERROR");
  }
};

// @desc    Đăng nhập
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    let { email, password } = req.body as { email?: string; password?: string };

    email = (email ?? "").trim().toLowerCase();
    password = String(password ?? "");

    if (!email || !password) {
      sendError(res, 400, "Vui lòng nhập email và mật khẩu.", "VALIDATION_ERROR");
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      // ✅ không tiết lộ email tồn tại hay không
      sendError(res, 401, "Email hoặc mật khẩu không đúng!", "INVALID_CREDENTIALS");
      return;
    }

    const ok = await user.matchPassword(password);
    if (!ok) {
      sendError(res, 401, "Email hoặc mật khẩu không đúng!", "INVALID_CREDENTIALS");
      return;
    }

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(String(user._id)),
    });
  } catch (error) {
    sendError(res, 500, (error as Error).message || "Server error", "SERVER_ERROR");
  }
};

// @desc    Lấy thông tin user hiện tại
// @route   GET /api/users/me   (khuyên dùng REST hơn)
// @access  Private
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // tuỳ bạn đang set req.user kiểu gì trong middleware
    const user = (req as any).user;

    // ✅ Chưa đăng nhập => 401 (không phải 404)
    if (!user) {
      sendError(res, 401, "Bạn chưa đăng nhập.", "UNAUTHORIZED");
      return;
    }

    // Nếu middleware chỉ gắn userId, thì nên query DB:
    // const dbUser = await User.findById(user._id).select("_id fullName email avatar");
    // if (!dbUser) return sendError(res, 404, "Không tìm thấy người dùng.", "USER_NOT_FOUND");

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (error) {
    sendError(res, 500, (error as Error).message || "Server error", "SERVER_ERROR");
  }
};


// @desc    Đăng nhập bằng Google (Nhận code từ FE -> Đổi lấy Token -> Trả JWT)
// @route   POST /api/auth/google
// @access  Public
export const loginWithGoogle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, redirectUri } = req.body;

    if (!code) {
      sendError(res, 400, "Thiếu mã xác thực từ Google (code).", "MISSING_CODE");
      return;
    }

    // ✅ redirectUri ưu tiên lấy từ FE (đúng môi trường), fallback env
    const finalRedirectUri =
      redirectUri || process.env.GOOGLE_REDIRECT_URI;

    if (!finalRedirectUri) {
      sendError(res, 500, "Thiếu GOOGLE_REDIRECT_URI.", "MISSING_REDIRECT_URI");
      return;
    }

    const oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      finalRedirectUri
    );

    const { tokens } = await oAuth2Client.getToken(code);

    if (!tokens.id_token) {
      sendError(res, 400, "Không nhận được id_token từ Google.", "MISSING_ID_TOKEN");
      return;
    }

    const ticket = await oAuth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      sendError(res, 400, "Không thể xác thực người dùng Google.", "GOOGLE_AUTH_FAILED");
      return;
    }

    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword =
        Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

      user = await User.create({
        fullName: name || "Google User",
        email,
        password: randomPassword,
        avatar: picture,
            provider: "google",   
    googleId: payload.sub,   
      });
    } else if (!user.avatar && picture) {
      user.avatar = picture;
      await user.save();
    }

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(String(user._id)),
    });
  } catch (error: any) {
    console.error("Google Login Error:", error?.message || error, error?.response?.data);
    sendError(res, 500, "Lỗi xác thực Google.", "GOOGLE_SERVER_ERROR");
  }
};
