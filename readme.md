# MERN Authentication Project

This project is a basic authentication system built using the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- User registration
- User login
- Password hashing
- JWT authentication
- Protected routes

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/abbu-imran-23/MERN_Advance_Auth_System.git
   ```
2. Navigate to the project directory:
   ```bash
   cd mern-auth
   ```
3. Install server dependencies:
   ```bash
   cd server
   npm install
   ```
4. Install client dependencies:
   ```bash
   cd ../client
   npm install
   ```

## Usage

1. Start the server:
   ```bash
   cd server
   npm start
   ```
2. Start the client:
   ```bash
   cd ../client
   npm start
   ```

## Configuration

Create a `.env` file in the `server` directory and add the following environment variables:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
