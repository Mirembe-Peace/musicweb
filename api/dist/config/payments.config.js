"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pesapalConfig = void 0;
const pesapalConfig = () => ({
    consumerKey: process.env.PESAPAL_CONSUMER_KEY,
    consumerSecret: process.env.PESAPAL_CONSUMER_SECRET,
    baseUrl: process.env.PESAPAL_BASE_URL,
});
exports.pesapalConfig = pesapalConfig;
//# sourceMappingURL=payments.config.js.map