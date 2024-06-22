const { body, validationResult } = require("express-validator");

const creatCourseValidatos = [
	body("title").notEmpty().withMessage("title is required").isLength({ min: 2 }).withMessage("title is short"),
	body("price").notEmpty().withMessage("price is required"),
];
module.exports = {
	creatCourseValidatos,
};
