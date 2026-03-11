const express = require("express");
const router = express.Router();
const controller = require("../controllers/adminCMSSection.controller");
const schema = require("../schema/adminCMSSection.schema");
const validation = require("../middleware/validation");
const { adminAuthToken } = require("../middleware/authorization");


router.post("/admin/cms/sectio/add", [validation(schema.cmsSchema), adminAuthToken], controller.addUpdateCMSSection);
router.post("/admin/cms/section/search", [adminAuthToken], controller.listingCMSSection);
// router.post("/admin/coupon/delete", [validation(schema.couponId), adminAuthToken], controller.deleteCoupons);
// router.post("/admin/coupon/status/update", [validation(schema.updateStatus), adminAuthToken], controller.updateStatus);
// router.post("/admin/coupon/detail", [validation(schema.couponId), adminAuthToken], controller.detailedCoupon);


module.exports = router;