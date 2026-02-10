const yup = require("yup");

exports.bookingId = yup.object({
    bookingId: yup
        .string()
        .typeError("bookingId must be a number")
        .required("bookingId is required")
});