module.exports = {

    otpMiddleware: async (req, res, next) => {
        if (req.session.otpVerified) {
            next();
        } else {
            res.redirect("/otpVerify");
        }
    }
}