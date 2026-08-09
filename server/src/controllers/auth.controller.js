import { registerSchema } from "../validators/auth.validator.js";
import { registerUser } from "../services/auth.service.js";
import { loginSchema } from "../validators/auth.validator.js";
import { loginUser } from "../services/auth.service.js";
import { refreshTokenSchema } from "../validators/auth.validator.js";
import { refreshAccessToken } from "../services/auth.service.js";
import { getUserById } from "../services/user.service.js";

export async function register(req, res, next) {
  try {
    const body = registerSchema.parse(req.body);

    const user = await registerUser(body);

    res.status(201).json({
      success: true,
      message: "User berhasil dibuat.",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const body = loginSchema.parse(req.body);

    const result = await loginUser(body);

    res.status(200).json({
      success: true,
      message: "Login berhasil.",
      user: {
        id: result.user.id,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        username: result.user.username,
        email: result.user.email,
        role: result.user.role,
      },
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    next(error);
  }
}

export async function refresh(req, res, next) {
  try {
    const body = refreshTokenSchema.parse(req.body);

    const accessToken = await refreshAccessToken(
      body.refreshToken
    );

    res.json({
      success: true,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res, next) {
  try {
    const user = await getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan.",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res) {
  res.status(200).json({
    success: true,
    message: "Logout berhasil.",
  });
}