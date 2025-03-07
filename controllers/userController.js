const Models = require("../models/index");
const bcrypt = require("bcrypt");
const helper = require("../helpers/validation");

module.exports = {
  login: async (req, res) => {
    try {
      res.render("loginPage");
    } catch (error) {
      throw error;
    }
  },

  logInDone: async (req, res) => {
    try {
      console.log("req.body:", req.body);

      const { email, password } = req.body;

      let user = await Models.userModel.findOne({
        where: { email, role: 0 },
        raw: false,
      });

      console.log("user:", user);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const otp = "1111";

      await user.update({ otp });

      req.session.user = user;

      res.redirect("/otpVerify");
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  dashboard: async (req, res) => {
    try {
      if (!req.session.user || !req.session.user.otpVerified) {
        return res.redirect("/login");
      }

      const userCount = await Models.userModel.count();

      res.render("dashboard", { userCount });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  otpVerify: async (req, res) => {
    try {
      res.render("otpVerify");
    } catch (error) {
      console.error("Error rendering OTP verification page:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  otpVerifyDone: async (req, res) => {
    try {
      console.log("Received body:", req.body);
      let otp = req.body.otp;
      console.log("Final OTP:", otp);

      if (!otp || otp.length !== 4) {
        return res.status(400).send("OTP is required and must be 4 digits");
      }

      if (otp !== "1111") {
        return res.status(400).send("Invalid OTP");
      }

      req.session.user = { otpVerified: true };
      req.session.save(() => {
        res.redirect("/");
      });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  changePassword: async (req, res) => {
    try {
      res.render("changePassword");
    } catch (error) {
      console.error("Error rendering OTP verification page:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  changePasswordDone: async (req, res) => {
    try {
      const schema = Joi.object().keys({
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().required(),
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const { oldPassword, newPassword } = value;

      const user = await Models.userModel.findOne({
        where: { id: req.user.id },
        raw: true,
      });
      if (!user) {
        return res.json({ message: "User not found" });
      }
      const match = await bcrypt.compare(req.body.oldPassword, user.password);
      if (match) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await Models.userModel.update(
          { password: hashedPassword },
          { where: { id: req.user.id } }
        );
        res.redirect("/changePassword");

        return res.json({ message: "Password reset successfully!" });
      } else {
        return res.json({ message: "old password is not correct" });
      }
    } catch (err) {
      console.error("Error during password reset:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  },
};
