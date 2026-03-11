const model = require("../models");
const common = require("../utils/common");
const commonConfig = require("../config/commonConfig");
const { Op } = require("sequelize");

const addUpdateCMSSection = async (req, res) => {
    try {
        const reqData = { ...req.body };
        let sectionId = reqData.cs_id ? reqData.cs_id : null;

        let payload = {
            cs_title: reqData.cs_title,
            cs_description: reqData.cs_description,
            cs_isActive: reqData.cs_isActive,
            cs_url: reqData.cs_url,
            cs_order: reqData.cs_order,
        };
        if (sectionId) {
            await model.tbl_cms_section.update(reqData, { where: { cs_id: sectionId } });
        } else {
            await model.tbl_cms_section.create(payload);
        }
        return common.response(req, res, commonConfig.successStatus, true, "CMS Section added successfully");
    } catch (error) {
        return common.response(req, res, commonConfig.errorStatus, false, error.message);
    }
};

const listingCMSSection = async (req, res) => {
    try {
        const reqData = { ...req.body };
        const page = Number(reqData.page) > 0 ? Number(reqData.page) : 1;
        const limit = Number(reqData.limit) > 0 ? Number(reqData.limit) : 10;
        const offset = (page - 1) * limit;
        const search = reqData.search?.trim() || "";
        let whereClause = {};
        if (search) {
            whereClause[Op.or] = [
                { cs_title: { [Op.like]: `%${search}%` } },
                { cs_slug: { [Op.like]: `%${search}%` } }
            ];
        }
        const { count, rows } = await model.tbl_cms_section.findAndCountAll({
            raw: true,
            where: whereClause,
            limit,
            offset,
            order: [['cs_order', 'ASC']],
            attributes: ['cs_id', 'cs_title', 'cs_slug', 'cs_isActive', 'cs_url', 'cs_order', 'cs_created_at']
        });
        if (rows.length === 0) {
            return common.response(req, res, commonConfig.successStatus, true, "No CMS Sections found");
        }
        const totalPages = Math.ceil(count / limit);
        return common.response(req, res, commonConfig.successStatus, true, "CMS Sections retrieved successfully", {
            totalRecords: count,
            currentPage: page,
            totalPages: totalPages,
            search,
            page,
            limit,
            offset,
            sections: rows,
        });
    } catch (error) {
        console.log(error);
        return common.response(req, res, commonConfig.errorStatus, false, error.message);
    }
}


module.exports = {
    addUpdateCMSSection,
    listingCMSSection
}