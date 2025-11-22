"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    const message = err.message || "An unexpected error occurred.";
    res.status(statusCode).json({
        success: false,
        message: message,
        data: err.data,
    });
};
exports.default = errorHandler;
//# sourceMappingURL=errorHandlerMiddleware.js.map