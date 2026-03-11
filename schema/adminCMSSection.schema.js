const yup = require("yup");

exports.cmsSchema = yup.object().shape({
    cs_title: yup
        .string()
        .trim()
        .required("Title is required"),

    cs_description: yup
        .string()
        .trim()
        .nullable(),

    cs_isActive: yup
        .number()
        .oneOf([0, 1], "Status must be 0 or 1")
        .typeError("Status must be a number")
        .required("Status is required"),
    cs_order: yup
        .number()
        .typeError("Order must be a number")
        .required("Order is required"),
    cs_url: yup
        .string()
        .trim()
        .required("URL is required")
});