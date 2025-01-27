/******************* Imports *********************/
import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { sendOnboardingEmail } from "../utils/mail/Onboarding.email";
import { sendPasswordChangedEmail } from "../utils/mail/passwordChanged.email";

/** User Interface **/
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  accessToken: string;
  refreshToken: string;
  isValidPassword: (password: string) => boolean;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
}

/** User Schema **/
const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
      expires: 60 * 60 * 1000,
    },
    accessToken: { type: String, default: null },
    refreshToken: { type: String, default: null },
  },
  { timestamps: true }
);

/******************* Middlewares *********************/
let isNewUser: boolean = false; // Track new user registration
let isPasswordUpdated: boolean = false; // Track password updates

userSchema.pre<IUser>("save", async function () {
  try {
    if (!this.isModified("password")) return;

    // Check if the document is new
    isNewUser = this.isNew;

    // Set `isPasswordUpdated` only for existing users
    if (!this.isNew) {
      isPasswordUpdated = true;
    }

    // Hash the Passowrd
    const hashedPassword = await hashPassword(this.password);
    this.password = hashedPassword;
  } catch (error) {
    console.error("Error in pre-save middleware", error);
  }
});

userSchema.post<IUser>("save", async function () {
  try {
    // Send onboarding email only for new users
    if (isNewUser) {
      await sendOnboardingEmail(this.email, this.name);
      // Reset the isNewUser flag
      isNewUser = false;
    }

    // Send password changed email only if the password was updated
    if (isPasswordUpdated) {
      await sendPasswordChangedEmail(this.email, this.name);
      isPasswordUpdated = false; // Reset the flag
    }
  } catch (error) {
    console.error("Error in post-save middleware", error);
  }
});

/******************* Methods *********************/

/**
 * Hash the Password
 * @param {string} password - Raw Password
 * @return {Promise<string>} hashedPassword - Hashed Password
 */
const hashPassword = async (password: string): Promise<string> => {
  try {
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(`${process.env.SALT_ROUNDS}`)
    );
    return hashedPassword;
  } catch (error) {
    console.error("Error while hashing password:", error);
    throw new Error("Failed to hash password");
  }
};

/**
 * Validates Password
 * @param {string} password - Raw Password
 * @return {Promise<boolean>} - Returns true if the password matches, otherwise false
 */
userSchema.methods.isValidPassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

/**
 * Generates an access token
 * @return {string} - Returns a signed JWT access token
 */
userSchema.methods.generateAccessToken = function (): string {
  const payload = {
    id: this._id,
  };

  const token = JWT.sign(payload, `${process.env.JWT_ACCESS_TOKEN_SECRET}`);

  return token;
};

/**
 * Generates a refresh token
 * @return {string} - Returns a signed JWT access token
 */
userSchema.methods.generateRefreshToken = function (): string {
  const payload = {
    id: this._id,
  };

  const token = JWT.sign(payload, `${process.env.JWT_REFRESH_TOKEN_SECRET}`);

  return token;
};

/** User Model **/
export const User = mongoose.model<IUser>("User", userSchema);
