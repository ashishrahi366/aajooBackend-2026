const model = require("../models");
const common = require("../utils/common");
const commonConfig = require("../config/commonConfig");
const { Op } = require("sequelize");
// const { CloudinaryManager } = require("../utils/cloudinary");
// const moduleConfig = require("../config/moduleConfigs");
// const methods = require("../utils/methods");

const hostListing = async (req, res) => {
    try {
        const reqData = { ...req.body };
        const page = Number(reqData.page) > 0 ? Number(reqData.page) : 1;
        const limit = 10;
        const offset = (page - 1) * limit;
        const search = reqData.search?.trim() || "";
        const status = reqData.status ?? null;

        let whereClause = {
            user_isDelete: commonConfig.isNo,
            user_isHost: commonConfig.isYes
        };
        let credWhereClause = {};
        if (search) {
            whereClause[Op.or] = [
                { user_fullName: { [Op.like]: `%${search}%` } },
                { "$userCred.cred_user_email$": { [Op.like]: `%${search}%` } },
            ];
        }
        if (status !== null) {
            whereClause.user_isActive = status;
        }
        const { rows, count } = await model.tbl_user.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: model.tbl_user_cred,
                    as: "userCred",
                    where: credWhereClause,
                    required: false,
                    attributes: ["cred_user_email"]
                },
                {
                    model: model.tbl_properties,
                    as: "hostProperty",
                    attributes: [],
                    required: false
                }
            ],
            limit,
            offset,
            order: [["added_at", "DESC"]],
            attributes: [
                "user_id",
                "user_fullName",
                "user_isActive",
                "user_isVerified",
                "added_at",
                [
                    model.sequelize.fn("COUNT", model.sequelize.col("hostProperty.property_id")),
                    "propertyCount"
                ]
            ],
            group: ["tbl_user.user_id", "userCred.cred_user_id"],
            subQuery: false
        });
        if (!rows) {
            return common.response(req, res, commonConfig.successStatus, true, "No records found")
        }
        console.log(count, "count")
        let totalPage = Math.ceil(count.length / limit);
        console.log(totalPage, "totalPage")
        return common.response(req, res, commonConfig.successStatus, true, "Host listing fetched successfully", {
            totalRecords: rows.length,
            currentPage: page,
            totalPages: totalPage,
            search,
            page,
            limit,
            offset,
            data: rows,
        });
    } catch (error) {
        console.log(error, "error in host listing");
        return common.response(req, res, commonConfig.errorStatus, false, error.message);
    }
};

module.exports = {
    hostListing
}
