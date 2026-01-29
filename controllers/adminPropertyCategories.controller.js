const model = require("../models");
const common = require("../utils/common");
const commonConfig = require("../config/commonConfig");
const { Op } = require("sequelize");

const { generateUniqueCategorySlug } = require("../utils/slugify");


const createOrUpdatePropertyCategory = async (req, res) => {
    try {
        const reqData = { ...req.body };
        let categoryId = reqData.categoryId;

        const slug = await generateUniqueCategorySlug(reqData.cat_title, categoryId || null);
        const payload = {
            cat_title: reqData.cat_title,
            cat_slug: `${slug}`,
            cat_isActive: reqData.cat_isActive,
            cat_isDelete: commonConfig.isNo,
        };
        if (categoryId) {
            await model.tbl_categories.updateCategory(categoryId, payload);
        } else {
            const data = await model.tbl_categories.createCategory(payload);
            categoryId = data.cat_id;
        }
        return common.response(req, res, commonConfig.successStatus, true, "Category saved successfully");
    } catch (error) {
        return common.response(req, res, commonConfig.errorStatus, false, error.message);
    }
};


const getPropertyCategories = async (req, res) => {
    // GET /api/property/categories?search=lux&page=1&limit=10
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;
        const search = req.query.search?.trim() || "";
        const status = req.query.status ?? null;

        const whereClause = { cat_isDelete: commonConfig.isNo };
        if (search) {
            whereClause.cat_title = { [Op.like]: `%${search}%`, };
        }
        if (status !== null) {
            whereClause.cat_isActive = status;
        }
        const { rows, count } = await model.tbl_categories.findAndCountAll({
            where: whereClause,
            limit: limit,
            offset: offset,
            // order: [["created_at", "DESC"]],
            raw: true
        });
        if (rows.lenght === 0) {
            return common.response(req, res, commonConfig.successStatus, true, "No categories found");
        }
        const totalPages = Math.ceil(count / limit);
        return common.response(req, res, commonConfig.successStatus, true, "Categories fetched successfully", {
            page,
            limit,
            offset,
            totalCount: count,
            totalPages,
            search,
            data: rows,
        });
    } catch (error) {
        return common.response(req, res, commonConfig.errorStatus, false, error.message);
    }
};

const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.body.categoryId;
        if (!categoryId) {
            return common.response(req, res, commonConfig.badRequestStatus, false, "Category ID is required");
        }
        await model.tbl_categories.updateCategory(categoryId, { cat_isDelete: commonConfig.isYes });
        return common.response(req, res, commonConfig.successStatus, true, "Category deleted successfully");
    } catch (error) {
        return common.response(req, res, commonConfig.errorStatus, false, error.message);
    }
};

const getCategory = async (req, res) => {
    try {
        const category = await model.tbl_categories.findOne({
            where: {
                cat_id: req.body.categoryId,
                cat_isDelete: commonConfig.isNo
            },
            raw: true
        });
        if (!category) {
            return common.response(req, res, commonConfig.notFoundStatus, false, "Category not found");
        }
        return common.response(req, res, commonConfig.successStatus, true, "Category fetched successfully", category);
    } catch (error) {
        return common.response(req, res, commonConfig.errorStatus, false, error.message);
    }
};

const updateStatus = async (req, res) => {
    try {
        const { categoryId, status } = req.body;
        const category = await model.tbl_categories.findOne({
            where: {
                cat_id: categoryId,
                cat_isDelete: commonConfig.isNo,
            },
            raw: true,
        });
        if (!category) {
            return common.response(req, res, commonConfig.notFoundStatus || 404, false, "Category not found");
        }
        await model.tbl_categories.updateCategory(categoryId, { cat_isActive: status });
        return common.response(req, res, commonConfig.successStatus, true, "Category status updated successfully");
    } catch (error) {
        return common.response(req, res, commonConfig.errorStatus, false, error.message);
    }
};



module.exports = {
    createOrUpdatePropertyCategory,
    getPropertyCategories,
    deleteCategory,
    getCategory,
    updateStatus
}