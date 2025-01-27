/******************* Imports *********************/
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import JWT, { JwtPayload } from "jsonwebtoken";

/** Request with User Interface **/
export interface IRequestWithUser extends Request {
  user?: JwtPayload | string;
}

/** Auth Middleware **/
const auth = async (
  req: IRequestWithUser,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    // Extracting JWT from request cookies, body or header
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    // Handle if the token is missing
    if (!token) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: `Token Missing` });
    }

    // Verifying the token
    try {
      const decode = JWT.verify(
        token,
        `${process.env.JWT_ACCESS_TOKEN_SECRET}`
      );

      // Storing the decoded JWT payload in the request object for further use
      req.user = decode;
    } catch (error) {
      // Handle if JWT verification fails
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: "token is invalid" });
    }

    next();
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: `Something Went Wrong While Validating the Token`,
    });
  }
};

export default auth;
