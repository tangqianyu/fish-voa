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
exports.fetchNewData = void 0;
const cheerio_1 = require("cheerio");
const axios_1 = require("axios");
const db_1 = require("./db");
const common_1 = require("./common");
const BASE_URL = 'https://www.51voa.com';
function fetchNewData(type, category) {
    return __awaiter(this, void 0, void 0, function* () {
        let pageNumber = 1;
        let total = 0;
        let pageUrl = `${BASE_URL}/${category}_${pageNumber}.html`;
        let lastestPost;
        if (type === 'post') {
            lastestPost = yield getLatestPost(category);
        }
        else if (type === 'video') {
            lastestPost = yield getLatestVideo(category);
        }
        try {
            const response = yield axios_1.default.get(pageUrl);
            const $ = cheerio_1.default.load(response.data);
            $('#righter .list > ul > li').each((_, element) => {
                (() => __awaiter(this, void 0, void 0, function* () {
                    const publish_date = convertToSQLiteDate($(element).contents().last().text().trim());
                    let title, post_link;
                    if (type === 'post') {
                        if ((0, common_1.compareDates)(publish_date, lastestPost.publish_date) === 1) {
                            title = $($(element).find('a[href^="/VOA_Special_English"]:not([class])')[0])
                                .text()
                                .trim();
                            post_link = $($(element).find('a[href^="/VOA_Special_English"]:not([class])')[0]).attr('href');
                            try {
                                const { content, audio_link, lrc_link } = yield getPostDetail(post_link);
                                try {
                                    const newPost = yield db_1.Post.create({
                                        title,
                                        category,
                                        audio_link,
                                        lrc_link,
                                        publish_date,
                                        content,
                                    });
                                    total++;
                                }
                                catch (error) {
                                    console.error('Error adding new post:', error);
                                }
                            }
                            catch (error) {
                                console.log(error);
                            }
                        }
                    }
                    else if (type == 'video') {
                        if ((0, common_1.compareDates)(publish_date, lastestPost.publish_date) === 1) {
                            title = title = $($(element).find('a[href^="/VOA_Videos"]:not([class])')[0])
                                .text()
                                .trim();
                            post_link = $($(element).find('a[href^="/VOA_Videos"]:not([class])')[0]).attr('href');
                            try {
                                const { poster_link, video_link } = yield getVideoDetail(post_link);
                                try {
                                    const newPost = yield db_1.Post.create({
                                        title,
                                        category,
                                        poster_link,
                                        video_link,
                                        publish_date,
                                    });
                                    total++;
                                }
                                catch (error) {
                                    console.error('Error adding new post:', error);
                                }
                            }
                            catch (error) {
                                console.log(error);
                            }
                        }
                    }
                }))();
            });
            return total;
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.fetchNewData = fetchNewData;
function getLatestPost(category) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const latestRecord = yield db_1.Post.findOne({
                where: { category },
                order: [['publish_date', 'DESC']],
            });
            return latestRecord;
        }
        catch (error) {
            console.error('Error retrieving the latest record:', error);
        }
    });
}
function getLatestVideo(category) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const latestRecord = yield db_1.Video.findOne({
                where: { category },
                order: [['publish_date', 'DESC']],
            });
            return latestRecord;
        }
        catch (error) {
            console.error('Error retrieving the latest record:', error);
        }
    });
}
function convertToSQLiteDate(dateStr) {
    // Split the input date string into day, month, and year components
    const [year, month, day] = dateStr.slice(1, -1).split('-');
    const fixYear = `20${year}`;
    const fixMonth = month < 10 ? `0${month}` : month;
    const fixDay = day < 10 ? `0${day}` : day;
    return `${fixYear}-${fixMonth}-${fixDay}`;
}
function getPostDetail(link) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`${BASE_URL}${link}`);
            const $ = cheerio_1.default.load(response.data);
            const content = $('#righter > .content').first().html() || '';
            const audio_link = $('#mp3').first().attr('href') || '';
            const lrc_link = $('#lrc').first().attr('href') || '';
            return { content, audio_link, lrc_link };
        }
        catch (error) {
            console.log(error);
        }
    });
}
function getVideoDetail(link) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`${BASE_URL}${link}`);
            const $ = cheerio_1.default.load(response.data);
            const poster_link = $('.video_content video').first().attr('poster') || '';
            const video_link = $('.video_content video source').first().attr('src') || '';
            return { poster_link, video_link };
        }
        catch (error) {
            console.log(error);
        }
    });
}
//# sourceMappingURL=fetchData.js.map