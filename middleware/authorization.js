const jwt = require('jsonwebtoken');
const common = require("../utils/common");
const commonConfig = require("../config/commonConfig");

exports.authenticateJWT = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        if (!token) {
            return common.response(req, res, 400, false, "token is required");
        }
        const actualToken = token.split(' ')[1];
        const decoded = jwt.verify(actualToken, commonConfig.JWT_SECRET);
        if (!decoded) {
            return common.response(req, res, 400, false, "token expired");
        }
        req.user = decoded;
        next();
    } catch (error) {
        if (error.message == "jwt expired") {
            return common.response(req, res, 400, false, "Session expired, please try again");
        }
        return common.response(req, res, 400, false, error.message, error.errors);
    }
};

exports.hostAuthentication = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        if (!token) {
            return common.response(req, res, 400, false, "token is required");
        }
        const actualToken = token.split(' ')[1];
        const decoded = jwt.verify(actualToken, commonConfig.JWT_SECRET);
        if (!decoded) {
            return common.response(req, res, 400, false, "token expired");
        }
        req.user = decoded;
        next();
    } catch (error) {
        return common.response(req, res, 400, false, error.message, error.errors);
    }
};


exports.adminAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return common.response(req, res, 401, false, "Unauthorized");
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        req.token = token;
        next();
    } catch (error) {
        return common.response(req, res, 401, false, "Invalid token");
    }
};

exports.adminAuthToken = async (req, res, next) => {
    try {
        if (req.method === "OPTIONS") return res.sendStatus(204);
        const authHeader = req.headers.authorization;
        console.log(authHeader, "authHeader")
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return common.response(req, res, commonConfig.unauthorizedStatus, false, "Authorization token required");
        }
        const token = authHeader.split(" ")[1];
        console.log(token, "token")

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            // Handle expired token specifically
            if (err.name === "TokenExpiredError") {
                return common.response(
                    req,
                    res,
                    commonConfig.unauthorizedStatus,
                    false,
                    "Token expired, please login again"
                );
            }
            return common.response(
                req,
                res,
                commonConfig.unauthorizedStatus,
                false,
                "Invalid token"
            );
        }

        // console.log(decoded, "decoded")
        if (!decoded.isAdmin) {
            return common.response(req, res, commonConfig.forbiddenStatus, false, "Admin access only");
        }
        req.admin = { adminId: decoded.adminId, isAdmin: decoded.isAdmin };
        next();
    } catch (error) {
        console.error("Admin auth error:", error.message);
        return common.response(req, res, commonConfig.unauthorizedStatus, false, "Invalid or expired token");
    }
};


// module.exports = adminAuth;
