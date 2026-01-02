'use server'

import { baseUrl } from '@/lib/api-client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'


export async function loginAction(formData: FormData) {
  const email = formData.get('email')
  const password = formData.get('password')

  if (!email || !password) {
    return { error: 'Vui lòng nhập đầy đủ thông tin.' }
  }

  try {
 
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { error: data.message || 'Đăng nhập thất bại.' }
    }

    const cookieStore = await cookies()

    // backend returns `token` field
    if (data.token) {
      cookieStore.set('access_token', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 ngày
      })
    } else {
      return { error: 'Đăng nhập thất bại.' }
    }

    // Nếu có Refresh Token, lưu luôn (tùy chiến lược của bạn)
    if (data.refreshToken) {
      cookieStore.set('refresh_token', data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 ngày
      })
    }

  } catch (err) {
    console.error('Login Error:', err)
    return { error: 'Có lỗi xảy ra, vui lòng thử lại sau.' }
  }


  redirect('/dashboard')
}
export async function signUpAction(formData: FormData) {
  const email = formData.get('email')
  const fullName = formData.get('fullName') // Khớp với name="fullName" ở Form
  const password = formData.get('password')
  const confirmPassword = formData.get('confirm-password')

  // 1. Validate phía Server (Bắt buộc)
  if (!email || !fullName || !password || !confirmPassword) {
    return { error: 'Vui lòng nhập đầy đủ thông tin.' }
  }

  if (password !== confirmPassword) {
    return { error: 'Mật khẩu xác nhận không khớp.' }
  }

  try {
    
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email, 
        fullName, 
        password 
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { error: data.message || 'Đăng ký thất bại.' }
    }

  } catch (err) {
    console.error('SignUp Error:', err)
    return { error: 'Có lỗi xảy ra, vui lòng thử lại sau.' }
  }

  redirect('/auth/sign-in?toast=signup_success') 
}
export async function getProfile() {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) return null

  try {
    const res = await fetch(`${baseUrl}/api/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Gửi token lên backend
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Đảm bảo luôn lấy dữ liệu mới nhất
    })

    if (!res.ok) {
      // Token hết hạn hoặc không hợp lệ
      if (res.status === 401) {
        // Xóa cookie rác đi nếu cần (tùy chọn)
        return null 
      }
      return null
    }

    const user = await res.json()
    return user 

  } catch (error) {
    console.error('Lỗi lấy thông tin user:', error)
    return null
  }
}

// Hàm đăng xuất (tiện thì viết luôn)
export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('access_token')
  cookieStore.delete('refresh_token')
  redirect('/auth/sign-in')
}


// ... các import cũ
// Thêm import helper để tái sử dụng logic set cookie (tùy chọn nhưng nên làm)

// 1. Action khởi tạo: Chuyển hướng người dùng sang Google
export async function loginWithGoogleAction() {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
  const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI // vd: http://localhost:3000/auth/google/callback

  if (!GOOGLE_CLIENT_ID || !REDIRECT_URI) {
    throw new Error('Thiếu biến môi trường Google')
  }

  // URL đăng nhập của Google
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile', // Quyền truy cập
    access_type: 'offline',
    prompt: 'consent',
  })

  const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`

  redirect(googleLoginUrl)
}

export async function handleGoogleCallback(code: string) {
  const cookieStore = await cookies()

  try {
    
    const response = await fetch(`${baseUrl}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }), // Gửi code google xuống backend
    })

    const data = await response.json()

    if (!response.ok) {
      return { error: data.message || 'Đăng nhập Google thất bại.' }
    }

    // Lưu Access Token (Logic y hệt hàm loginAction cũ của bạn)
    if (data.token) {
      cookieStore.set('access_token', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24,
      })
    }

    // Lưu Refresh Token nếu có
    if (data.refreshToken) {
      cookieStore.set('refresh_token', data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
    }

  } catch (err) {
    console.error('Google Login Error:', err)
    return { error: 'Lỗi kết nối server.' }
  }

  redirect('/dashboard')
}