/******************* Imports *********************/
import { NextFunction, Request, Response } from "express";
import { IUser, User } from "../models/user.model";
import { StatusCodes } from "http-status-codes";
import { generateOtp } from "../utils/generators/otp";
import { IOtp, OTP } from "../models/otp.model";
import { IRequestWithUser } from "../middlewares/auth.middleware";
import { JwtPayload } from "jsonwebtoken";

/** Signup Controller **/
const signup = async (req: Request, res: Response): Promise<any> => {
  try {
    // Parse req.body
    const { name, email, password } = req.body;

    // Insert User to Database
    const user: IUser | null = await User.create({
      name,
      email,
      password,
      isVerified: true,
    });

    // Remove Password before sending response to client
    const userObject = user.toObject();
    delete userObject.password;

    // Return Success Response once created
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "User Registered Successfully",
      data: userObject,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/** Login Controller **/
const login = async (req: Request, res: Response): Promise<any> => {
  try {
    // Parse user details from request body
    const { email, password } = req.body;

    // Check if the user already exist with the email
    const user: IUser | null = await User.findOne({ email });

    // Handle if the user does not exist
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Email not registered",
      });
    }

    // Validate Password
    const isValidPassword = await user?.isValidPassword(password);

    // Handle if password is invalid
    if (!isValidPassword) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Incorrect Password",
      });
    }

    // If valid password, generate Access and Refresh Token
    const accessToken = user?.generateAccessToken();
    const refreshToken = user?.generateRefreshToken();

    // Store the Tokens in the user document
    const updatedUser = await User.findByIdAndUpdate(
      user?._id,
      {
        accessToken,
        refreshToken,
      },
      { new: true }
    ).select("-password");

    // Return Success Response and Set Tokens in Cookies
    return res
      .status(StatusCodes.OK)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 3 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: "Login successfull",
        data: {
          user: updatedUser,
        },
      });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/** Send OTP Controller **/
const sendOTP = async (req: Request, res: Response): Promise<any> => {
  try {
    // Parse req.body
    const { email } = req.body;

    // Check if the user already exists
    const isExistingUser: IUser | null = await User.findOne({ email });

    // Handle if the user already exists
    if (isExistingUser) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: "User Already Exist",
      });
    }

    // Either deactivate or delete any existing OTPs for the user
    // await OTP.updateMany({ email, isActive: true }, { isActive: false });
    await OTP.deleteMany({ email });

    // Generate OTP
    const otp = generateOtp();

    // Save OTP and send mail to the user
    await OTP.create({ email, otp });

    // Return success response
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Verification code sent to your email. Please verify.",
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/** Verify OTP Controller **/
const verifyOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { email, otp } = req.body;

    // Check if the user already exists
    const isExistingUser: IUser | null = await User.findOne({ email });

    // Handle if the user is already existing
    if (isExistingUser) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: "User Already Exist",
      });
    }

    // Fetch the OTP Record
    const otpRecord: IOtp | null = await OTP.findOne({ email });

    // Handle if the OTP has expired
    if (!otpRecord) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "OTP has expired",
      });
    }

    // Validate OTP
    const isValidOTP = await otpRecord?.isValidOTP(otp);

    // Handle if OTP is invalid
    if (!isValidOTP) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Delete OTP once it has been used
    await OTP.findByIdAndDelete(otpRecord?._id);

    next();
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/** Logout Controller **/
const logout = async (_: Request, res: Response): Promise<any> => {
  try {
    res.send("Logout route");
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/** Change Password Controller **/
const changePassword = async (
  req: IRequestWithUser,
  res: Response
): Promise<any> => {
  try {
    // Parse user id from req.user
    const { id } = req.user as JwtPayload;

    // Fetch user record
    const user: IUser | null = await User.findById(id);

    // Handle if the user does not exist
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Email not registered",
      });
    }

    // Parse passwords from req.body
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    // Handle if oldPassword and newPassword are same
    if (oldPassword === newPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "New password cannot be same as old password",
      });
    }

    // Handle if newPassword and confirmNewPassword are not matched
    if (newPassword !== confirmNewPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "New password and confirm password did not match",
      });
    }

    // Validate Old Password
    const isValidPassword = await user?.isValidPassword(oldPassword);

    // Handle if password is invalid
    if (!isValidPassword) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Incorrect Password",
      });
    }

    // Update Password
    user.password = newPassword;
    await user.save();

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/** Reset Password Controller **/
const resetPassword = async (_: Request, res: Response) => {
  try {
    res.send("Logout route");
  } catch (error) {}
};

export {
  signup,
  login,
  logout,
  sendOTP,
  verifyOTP,
  changePassword,
  resetPassword,
};
