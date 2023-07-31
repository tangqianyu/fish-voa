"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findVideosByCategory = exports.findVideoById = void 0;
const db_1 = require("./db");
const sequelize_1 = require("sequelize");
function findVideoById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const video = yield db_1.Video.findByPk(id, {
                raw: true,
            });
            return video;
        }
        catch (err) {
            console.error('Error finding video:', err);
            throw err;
        }
    });
}
exports.findVideoById = findVideoById;
function findVideosByCategory(category, keyword = '', orderType, pageNumber, pageSize) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const offset = (pageNumber - 1) * pageSize;
            let whereQuery = { category };
            if (keyword) {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { title: { [sequelize_1.Op.like]: `%${keyword}%` } });
            }
            const videos = yield db_1.Video.findAll({
                raw: true,
                where: whereQuery,
                attributes: ['id', 'title', 'category', 'publish_date'],
                offset,
                limit: pageSize,
                order: [['publish_date', orderType]],
            });
            return videos;
        }
        catch (err) {
            console.error('Error finding videos:', err);
            throw err;
        }
    });
}
exports.findVideosByCategory = findVideosByCategory;
//# sourceMappingURL=video.js.map