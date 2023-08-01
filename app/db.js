"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Video = exports.Post = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const path = require("path");
const dbPath = path.join(__dirname, 'data.db');
exports.sequelize = new sequelize_1.Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
});
exports.Post = exports.sequelize.define('posts', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: sequelize_1.DataTypes.TEXT,
    },
    category: {
        type: sequelize_1.DataTypes.TEXT,
    },
    audio_link: {
        type: sequelize_1.DataTypes.TEXT,
    },
    lrc_link: {
        type: sequelize_1.DataTypes.TEXT,
    },
    publish_date: {
        type: sequelize_1.DataTypes.DATEONLY,
    },
    content: {
        type: sequelize_1.DataTypes.TEXT,
    },
    translate_content: {
        type: sequelize_1.DataTypes.TEXT,
    },
}, {
    timestamps: false, // 禁用 createdAt 和 updatedAt
});
exports.Video = exports.sequelize.define('videos', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: sequelize_1.DataTypes.TEXT,
    },
    category: {
        type: sequelize_1.DataTypes.TEXT,
    },
    poster_link: {
        type: sequelize_1.DataTypes.TEXT,
    },
    video_link: {
        type: sequelize_1.DataTypes.TEXT,
    },
    publish_date: {
        type: sequelize_1.DataTypes.DATEONLY,
    },
}, {
    timestamps: false, // 禁用 createdAt 和 updatedAt
});
//# sourceMappingURL=db.js.map