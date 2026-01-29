const common = require("../utils/common");
const validation = (schema) => {
    return async (req, res, next) => {
        try {
            const dataToValidate = { ...req.body, ...req.params, ...req.query };
            await schema.validate(dataToValidate, { abortEarly: false });
            next();
        } catch (error) {
            return common.response(req, res, 422, false, error.message, error.errors);
        }
    }
};
module.exports = validation;    