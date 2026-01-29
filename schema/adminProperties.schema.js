const yup = require("yup");

//----------------AMENETIES SCHEMA----------------//
exports.createOrUpdateAmenitySchema = yup.object({
    amenetiesId: yup
        .number()
        .typeError("Amenity ID must be a number")
        .integer("Amenity ID must be an integer")
        .positive("Amenity ID must be greater than zero")
        .nullable()
        .optional(),

    ameneties_name: yup
        .string()
        .trim()
        .min(2, "Amenity title must be at least 2 characters")
        .max(200, "Amenity title cannot exceed 200 characters")
        .required("Amenity title is required"),

    ameneties_isActive: yup
        .string()
        .oneOf(["0", "1"], "Amenity status must be 0 (Inactive) or 1 (Active)")
        .required("Amenity status is required"),
});

exports.amenityId = yup.object({
    amenetiesId: yup
        .number()
        .typeError("Amenity ID must be a number")
        .integer("Amenity ID must be an integer")
        .positive("Amenity ID must be greater than zero")
        .required("Amenity ID is required"),
});

exports.amenityStatus = yup.object({
    amenetiesId: yup
        .number()
        .typeError("Amenity ID must be a number")
        .integer("Amenity ID must be an integer")
        .positive("Amenity ID must be greater than zero")
        .required("Amenity ID is required"),

    ameneties_isActive: yup
        .string()
        .oneOf(["0", "1"], "Amenity status must be 0 (Inactive) or 1 (Active)")
        .required("Amenity status is required"),
});