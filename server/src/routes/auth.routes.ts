/******************* Imports *********************/
import express, { Router } from "express";
import {
  changePassword,
  login,
  logout,
  resetPassword,
  sendOTP,
  signup,
  verifyOTP,
} from "../controllers/auth.controller";
import validateSchema from "../middlewares/schemaValidator.middleware";
import {
  loginSchema,
  signupWithoutOTPSchema,
  signupWithOTPSchema,
} from "../schemas/user.schema";
import auth from "../middlewares/auth.middleware";

const router: Router = express.Router();

/******************* Auth Routes *********************/

/** Send OTP **/
router.post("/send-otp", validateSchema(signupWithoutOTPSchema), sendOTP);

/** SignUp **/
router.post("/signup", validateSchema(signupWithOTPSchema), verifyOTP, signup);

/** Login **/
router.post("/login", validateSchema(loginSchema), login);

/** Logout **/
router.post("/logout", auth, logout);

/** Change Password **/
router.post("/change-password", auth, changePassword);

/** Reset Password **/
router.post("/reset-password", auth, resetPassword);

export default router;
