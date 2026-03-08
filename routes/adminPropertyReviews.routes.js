const express = require("express");
const router = express.Router();
const controller = require("../controllers/adminPropertyReviews.controller");
const schema = require("../schema/adminPropertyReviews.schema");
const validation = require("../middleware/validation");
const { adminAuthToken } = require("../middleware/authorization");
const { upload } = require("../utils/fileHandler");
const { adminApiLimiter } = require("../middleware/adminRateLimiter");


// router.post("/admin/property/create", upload.fields([{ name: "propertyCover", maxCount: 1 }, { name: "propertyImage" }, { name: "propertyDoc" }]), [validation(schema.propertySchema), adminAuthToken], controller.createuUpdateProperty);
router.post("/admin/propety/review/search", [validation(schema.reviewSearchSchema), adminAuthToken], controller.reviewListing);
router.post("/admin/propety/review/update", [validation(schema.updateBookingStatusSchema), adminApiLimiter, adminAuthToken,], controller.updateReview);
// router.post("/admin/booking/update", [validation(schema.bookingStatusUpdate), adminAuthToken], controller.updateBookingStatusforBookings);
router.post("/admin/property/review/detail", [adminAuthToken], controller.detailedReview);
// router.get("/admin/booking/status/list", [adminAuthToken], controller.bookingStatusListing);
// router.post("/admin/booking/status/update", [validation(schema.statusUpdate), adminAuthToken], controller.updateBookingStatus);
// router.post("/admin/booking/status/listing/admin-page", [adminAuthToken], controller.bookingStatusListingforAdminPage);


module.exports = router;