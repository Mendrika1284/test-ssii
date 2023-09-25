"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.system = void 0;
const lodash_1 = require("lodash");
exports.system = {
    metaUser: { id: "system", scope: "system", username: "system" },
    getSystemMetaIfUserMetaNotExist: (meta) => {
        if (meta.user) {
            return meta;
        }
        return (0, lodash_1.cloneDeep)(Object.assign(meta, { user: exports.system.metaUser })); // Clone deep because rewrite system.metaUser on system.impersonate and on system.depersonate error for sub system
    },
};
//# sourceMappingURL=system.js.map