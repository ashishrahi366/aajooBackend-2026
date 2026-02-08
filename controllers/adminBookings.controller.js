const model = require("../models");
const common = require("../utils/common");
const commonConfig = require("../config/commonConfig");
const { Op } = require("sequelize");
const { CloudinaryManager } = require("../utils/cloudinary");
const moduleConfig = require("../config/moduleConfigs");
const methods = require("../utils/methods");

const getBookingList = async (req, res) => {
    try {
        const reqData = { ...req.body };
        const page = Number(reqData.page) > 0 ? Number(reqData.page) : 1;
        const limit = Number(reqData.limit) > 0 ? Number(reqData.limit) : 10;
        const offset = (page - 1) * limit;
        const search = reqData.search?.trim() || "";
        const status = reqData.status ?? null;
        const paymentStatus = reqData.paymentStatus ?? null;
        const categoryId = reqData.categoryId ?? null;
        const fromDate = reqData.fromDate ? new Date(reqData.fromDate) : null;
        const toDate = reqData.toDate ? new Date(reqData.toDate) : null;

        let whereClause = {};
        if (reqData.search) {
            whereClause.book_id = reqData.bookingId;
        }


        const { rows, count } = await model.tbl_bookings.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            include: [
                // {
                //     model: model.tbl_book_details,
                //     as: "bookDetails",
                //     attributes: ["bd_check_in_date", "bd_check_out_date"]
                // },
                {
                    model: model.tbl_user,
                    as: "userDetails",
                    attributes: ["user_fullName"]
                },
                {
                    model: model.tbl_properties,
                    as: "bookingProperty",
                    attributes: ["property_name"]
                },
                {
                    model: model.tbl_book_status,
                    as: "bookingStatus",
                    attributes: ["bs_title", "bs_code"]
                }
            ],
            attributes:["book_pri_id","book_id","book_total_amt","book_is_paid","book_added_at"],
            order: [["book_added_at", "DESC"]],
            raw:true
        });
        console.log(rows,"row")
        if (rows.length === 0) {
            return common.response(req, res, commonConfig.notFoundStatus, false, "No bookings found");
        }
        const totalPages = Math.ceil(count / limit);
        return common.response(req, res, commonConfig.successStatus, true, "Booking listing fetched successfully", {
            page,
            limit,
            offset,
            totalRecords: count,
            currentPage: page,
            totalPages,
            bookings: rows
        });
    } catch (error) {
        console.log(error)
        return common.response(req, res, commonConfig.errorStatus, false, error.message);
    }
};

module.exports = {
    getBookingList
}