const express = require("express");
const router = express.Router();
const controller = require("../controllers/adminProperty.controller");
const schema = require("../schema/adminProperties.schema");
const validation = require("../middleware/validation");
const { adminAuthToken } = require("../middleware/authorization");
const { upload } = require("../utils/fileHandler");
const { generalLimiter, uploadLimiter } = require("../middleware/rateLimiter");

// router.post("/admin/category/create", [validation(schema.propertyCategorySchema), adminAuthToken], controller.createOrUpdatePropertyCategory);
router.post("/admin/properties/search", [generalLimiter, adminAuthToken], controller.PropertySearch);
router.post("/admin/categories/delete", [validation(schema.propertyIdSchema), adminAuthToken], controller.deleteProperty);
// router.post("/admin/category", [validation(schema.categoryId), adminAuthToken], controller.getCategory);
router.post("/admin/properties/update-status", [validation(schema.propertyStatusSchema), adminAuthToken], controller.updateStatus);





module.exports = router;