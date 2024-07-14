import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../model/User.js";

class AuthController {
  // login module
  async testLogin(req, res) {
    const { user, psw } = req.query;
    // if all required values are present to login user
    if (user && psw) {
      try {
        const foundUser = await User.findOne({ username: user }).exec();
        // const foundUser = usersDB.users.find((person) => person.username === user);
        if (!foundUser) return res.status(401).json({ message: "Invalid username" }); // unauthorized
        // evaluate password
        const match = await bcrypt.compare(psw, foundUser.password);
        if (!match) return res.status(401).json({ message: "Invalid password" });
        // create JWT's
        const payload = { username: foundUser.username, email: foundUser.email };

        const accessToken = JWT.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "10min",
        });

        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          sameSite: "None",
          secure: true,
          maxAge: 10 * 60 * 1000,
        });

        res.status(200).json({ accessToken, user: foundUser });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Oops! Something went wrong." });
      }
    } else {
      res.status(200).json({ message: "You can enter user and psw to login directly" });
    }
  }

  // login module
  async handleLogin(req, res) {
    const { user, psw } = req.body;
    if (!user.trim() || !psw.trim())
      return res.status(400).json({ message: "Username and password required" });

    try {
      const foundUser = await User.findOne({ username: user }).exec();
      // const foundUser = usersDB.users.find((person) => person.username === user);
      if (!foundUser) return res.status(401).json({ message: "Invalid username" }); // unauthorized
      // evaluate password
      const match = await bcrypt.compare(psw, foundUser.password);
      if (!match) return res.status(401).json({ message: "Invalid password" });

      // create JWT's
      const payload = { username: foundUser.username, email: foundUser.email };
      const accessToken = JWT.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "10min",
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 10 * 60 * 1000,
      });
      res.status(200).json({ accessToken, user: foundUser });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Oops! Something went wrong." });
    }
  }

  // Logout module
  async handleLogout(req, res) {
    // on client side, also delete the accessToken
    const { accessToken } = req.cookies;
    if (!accessToken) return res.status(204).json({ message: "Already logged out!" });

    res.clearCookie("accessToken");

    res.status(204).json({ message: "Successfully logged out" });
  }
}

export default AuthController;
