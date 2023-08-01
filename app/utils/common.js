"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareDates = void 0;
// 将时间字符串转换成 Date 对象
function parseDate(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); // 月份需要减去1，因为 JavaScript 中的月份是从0开始的
}
// 比较时间大小
function compareDates(dateString1, dateString2) {
    const date1 = parseDate(dateString1);
    const date2 = parseDate(dateString2);
    if (date1 < date2) {
        return -1; // date1 比 date2 小
    }
    else if (date1 > date2) {
        return 1; // date1 比 date2 大
    }
    else {
        return 0; // 两个日期相等
    }
}
exports.compareDates = compareDates;
//# sourceMappingURL=common.js.map