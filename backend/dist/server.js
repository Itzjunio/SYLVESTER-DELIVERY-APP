"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const db_1 = require("./shared/config/db");
const PORT = process.env.PORT || 3000;
const startServer = async () => {
    try {
        await (0, db_1.connectDB)();
        app_1.server.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map