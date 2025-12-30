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