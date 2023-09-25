"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareByKey = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const compareByKey = (key, direction) => (a, b) => {
    const fieldA = a[key];
    const fieldB = b[key];
    let comparison = 0;
    if (fieldA > fieldB) {
        comparison = 1;
    }
    else if (fieldA < fieldB) {
        comparison = -1;
    }
    return direction === "asc" ? comparison : -comparison;
};
exports.compareByKey = compareByKey;
//# sourceMappingURL=sort.lib.js.map