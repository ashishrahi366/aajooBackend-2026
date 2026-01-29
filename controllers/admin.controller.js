const model = require("../models");
const common = require("../utils/common");
const commonConfig = require("../config/commonConfig");
const methods = require("../utils/methods");
const moduleConfig = require("../config/moduleConfigs");


const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await model.tbl_admins.findAdmin({ admin_username: username, });
        console.log(admin,"admin")
        if (!admin || admin == null) {
            await model.tbl_admin_login_logs.create({
                admin_id: null,
                ip_address: req.ip,
                user_agent: req.headers["user-agent"],
                is_success: false,
            });
            console.log("iugcfhvbnml")
            return common.response(req, res, commonConfig.errorStatus, false, "Invalid credentials");
        }
        const isMatch = await methods.verifyPassword(password, admin.admin_password);

        if (!isMatch) {
            await model.tbl_admin_login_logs.create({
                admin_id: admin.admin_id,
                role_id: admin.role_id || null,
                ip_address: req.ip,
                user_agent: req.headers["user-agent"],
                is_success: false,
            });
            return common.response(req, res, commonConfig.errorStatus, false, "Invalid credentials");
        }

        const token = await methods.genrateToken({
            adminId: admin.admin_id,
            isAdmin: admin.admin_isAdmin,
        });

        await model.tbl_admin_login_logs.create({
            admin_id: admin.admin_id,
            role_id: admin.role_id || null,
            ip_address: req.ip,
            user_agent: req.headers["user-agent"],
            is_success: true,
        });

        const { admin_password, ...safeAdmin } = admin;
        return common.response(req, res, commonConfig.successStatus, true, "Login successful", { admin: { ...safeAdmin, token, } }
        );
    } catch (error) {
        console.error("Admin login error:", error);
        try {
            await model.tbl_admin_login_logs.create({
                admin_id: null,
                ip_address: req.ip,
                user_agent: req.headers["user-agent"],
                is_success: false,
            });
        } catch (e) {
            console.error("Failed to log admin login attempt:", e);
        }
        return common.response(req, res, commonConfig.errorStatus, false, "Something went wrong. Please try again.");
    }
};
const adminLogout = async (req, res) => {
    try {
        const adminId = req.admin?.adminId; // set by auth middleware
        const token = req.token; // extracted token
        if (adminId) {
            await model.tbl_admin_login_logs.create({
                admin_id: adminId,
                role_id: null,
                ip_address: req.ip,
                user_agent: req.headers["user-agent"],
                login_at: new Date(),
                is_success: true,
                // action: "LOGOUT"
            });
        }
        return common.response(req, res, commonConfig.successStatus, true, "Logout successful");
    } catch (error) {
        console.error("Admin logout error:", error);
        return common.response(req, res, commonConfig.errorStatus, false, "Something went wrong. Please try again.");
    }
};


const addCreate = async (req, res) => {
    try {
        const password = await methods.hashPassword(req.body.password);
        return common.response(req, res, commonConfig.successStatus, true, "success", password);
    } catch (error) {
        return common.response(req, res, commonConfig.errorStatus, false, error.message);
    }
};

module.exports = {
    adminLogin,
    addCreate,
    adminLogout
}