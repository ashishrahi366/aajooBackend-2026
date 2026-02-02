const model = require("../models");
const common = require("../utils/common");
const commonConfig = require("../config/commonConfig");
const { Op } = require("sequelize");
const { CloudinaryManager } = require("../utils/cloudinary");
const moduleConfig = require("../config/moduleConfigs");
const methods = require("../utils/methods");

const cloudinaryInstance = new CloudinaryManager();

const PropertySearch = async (req, res) => {
    try {
        const reqData = { ...req.body };
        const page = Number(reqData.page) > 0 ? Number(reqData.page) : 1;
        const limit = 10;
        const offset = (page - 1) * limit;
        const search = reqData.search?.trim() || "";
        const status = reqData.status ?? null;

        let whereCondition = {
            is_deleted: 0,
        };
        if (status) {
            whereCondition.is_active = status;
        }
        if (search) {
            whereCondition.property_name = { [Op.iLike]: `%${search}%` }
        }
        const { count, rows } = await model.tbl_properties.findAndCountAll({
            where: whereCondition,
            limit: limit,
            offset: offset,
            include: [
                {
                    model: model.tbl_user,
                    as: 'HostDetails',
                    required: false,
                    attributes: ['user_fullName'],
                }
            ],
            order: [['property_id', 'DESC']],
            attributes: ["property_id", "property_name", "is_active"],
            raw: true,
        });
        if (count === commonConfig.isNo) {
            return common.response(req, res, commonConfig.successStatus, false, "No property found", { totalRecords: 0, currentPage: page, properties: [], });
        }
        const propCategories = await model.tbl_prop_to_cat.findAll({
            where: {
                pt_cat_prop_id: rows.map(r => r.property_id)
            },
            include: [{
                model: model.tbl_categories,
                as: 'category',
                attributes: ['cat_title']
            }],
            raw: true
        });

        const categoryMap = {};

        propCategories.forEach(item => {
            const propId = item.pt_cat_prop_id;
            if (!categoryMap[propId]) categoryMap[propId] = [];
            categoryMap[propId].push(item['category.cat_title']);
        });

        const finalProperties = rows.map(prop => ({
            ...prop,
            categories: categoryMap[prop.property_id] || []
        }));
        return common.response(req, res, commonConfig.successStatus, true, "User listing fetched successfully", {
            totalRecords: count,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            search,
            page,
            limit,
            offset,
            properties: finalProperties,
        });

    } catch (error) {
        return common.response(req, res, commonConfig.errorStatus, false, error.message);
    }
};

const updateStatus = async (req, res) => {
    try {
        const { propertyId, status } = req.body;
        const property = await model.tbl_properties.findOne({ where: { property_id: propertyId } });
        if (!property) {
            return common.response(req, res, commonConfig.successStatus, false, "Property not found");
        }
        await model.tbl_properties.update({ is_active: status }, { where: { property_id: propertyId } });
        return common.response(req, res, commonConfig.successStatus, true, "Property status updated successfully");
    } catch (error) {
        return common.response(req, res, commonConfig.errorStatus, false, error.message);
    }
};

const deleteProperty = async (req, res) => {
    try {
        const { propertyId } = req.body;
        const property = await model.tbl_properties.findOne({ where: { property_id: propertyId } });
        if (!property) {
            return common.response(req, res, commonConfig.successStatus, false, "Property not found");
        }
        await model.tbl_properties.update({ is_deleted: 1 }, { where: { property_id: propertyId } });
        return common.response(req, res, commonConfig.successStatus, true, "Property deleted successfully");
    } catch (error) {
        return common.response(req, res, commonConfig.errorStatus, false, error.message);
    }
};
const getPropetyById = async (req, res) => {
    try {
        const { propertyId } = req.body;
        const property = await model.tbl_properties.findOne({
            where: { property_id: propertyId },
            attributes: { exclude: ["is_deleted", "created_at", "updated_at"] },
            raw: true
        });
        if (!property) {
            return common.response(req, res, commonConfig.successStatus, false, "Property not found");
        }

    } catch (error) {
        return common.response(req, res, commonConfig.errorStatus, false, error.message);
    }
};


module.exports = { PropertySearch, updateStatus, deleteProperty }