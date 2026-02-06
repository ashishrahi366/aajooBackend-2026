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

    amn_title: yup
        .string()
        .trim()
        .min(2, "Amenity title must be at least 2 characters")
        .max(200, "Amenity title cannot exceed 200 characters")
        .required("Amenity title is required"),

    amn_isActive: yup
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

    amn_isActive: yup
        .string()
        .oneOf(["0", "1"], "Amenity status must be 0 (Inactive) or 1 (Active)")
        .required("Amenity status is required"),
});


//----------------PROPERTIES SCHEMA----------------//

exports.propertyStatusSchema = yup.object({
    propertyId: yup.number()
        .required("Property ID is required"),

    status: yup.number()
        .oneOf([0, 1], "Status must be 0 or 1")
        .required("Status is required"),
});
exports.propertyIdSchema = yup.object({
    propertyId: yup.number()
        .required("Property ID is required"),
});

// import * as yup from "yup";

exports.propertySchema = yup.object().shape({
    property_name: yup
        .string()
        .trim()
        .required("Property name is required"),

    property_host_id: yup
        .number()
        .typeError("Host is required")
        .required("Host is required"),

    property_address: yup
        .string()
        .trim()
        .required("Property address is required"),

    property_longitude: yup
        .number()
        .typeError("Longitude is required")
        .required("Longitude is required"),

    property_latitude: yup
        .number()
        .typeError("Latitude is required")
        .required("Latitude is required"),

    property_desc: yup
        .string()
        .trim()
        .required("Property description is required"),

    property_price: yup
        .number()
        .typeError("Property price is required")
        .required("Property price is required"),

        property_mini_price: yup
        .number()
        .transform((_, val) =>
            val === "" || val === null ? undefined : Number(val)
        )
        // .typeError("Minimum price must be a number")
        // .required("Minimum price is required")
        .test(
            "mini-less-than-price",
            "Minimum price must be less than property price",
            function (value) {
                const { property_price } = this.parent;
                if (value == null || property_price == null) return true;
                return value < property_price;
            }
        ),

    property_city: yup
        .string()
        .trim()
        .required("City is required"),

    property_zip: yup
        .string()
        .trim()
        .required("Zip code is required"),

    property_state: yup
        .string()
        .trim()
        .required("State is required"),

    property_contry: yup
        .string()
        .trim()
        .required("Country is required"),

    property_email: yup
        .string()
        .email("Invalid email format")
        .nullable(),

    is_active: yup
        .boolean()
        .required("Active status is required"),

    is_verify: yup
        .number()
        .oneOf([0, 1], "Verify must be 0 or 1")
        .required("Verify status is required"),

    is_luxury: yup
        .number()
        .oneOf([0, 1], "Luxury must be 0 or 1")
        .required("Luxury status is required"),

    // ===== Property Details =====
    propDetail_isPetFriendly: yup.boolean(),
    propDetail_isSmoke: yup.boolean(),

    propDetail_inTime: yup
        .string()
        .nullable(),

    propDetail_outTime: yup
        .string()
        .nullable(),

    propDetail_no_of_beds: yup
        .number()
        .integer()
        .min(0)
        .nullable(),

    propDetail_no_of_guests: yup
        .number()
        .integer()
        .min(0)
        .nullable(),

    propDetail_weeklyMini_price: yup
        .number()
        .min(0)
        .nullable(),

    propDetail_weeklyMax_price: yup
        .number()
        .min(0)
        .nullable(),

    propDetail_monthly_security: yup
        .number()
        .min(0)
        .nullable(),

    propDetail_extra: yup
        .string()
        .nullable(),

    // ===== Relations =====
    ameneties: yup
        .array()
        .of(yup.number().typeError("Amenity id must be a number"))
        .nullable(),

    categories: yup
        .array()
        .of(yup.number().typeError("Category id must be a number"))
        .nullable(),

    tags: yup
        .array()
        .of(yup.number().typeError("Tag id must be a number"))
        .nullable(),
});
