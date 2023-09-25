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
exports.MoleculerLib = void 0;
const system_1 = require("./auth/system");
var MoleculerLib;
(function (MoleculerLib) {
    /**
     * Wait for the specified services to become available/registered with this broker.
     *
     * @param service The service instance
     * @param serviceNames The service, or services, we are waiting for.
     * @param timeout The total time this call may take. If this time has passed and the service(s)
     * 						    are not available an error will be thrown. (In milliseconds)
     * @param interval The time we will wait before once again checking if the service(s) are available (In milliseconds)
     */
    MoleculerLib.waitIsAvailableServices = (service, serviceNames, timeout, interval) => __awaiter(this, void 0, void 0, function* () {
        const availableServices = yield service.waitForServices(serviceNames, timeout, interval);
        return availableServices.statuses
            .filter(({ name }) => serviceNames.includes(name))
            .every(({ available }) => !!available);
    });
    /**
     * Create an moleculer context
     * @param service The service of the context
     * @param type Context type
     * @param name Context name available in service
     * @param meta Context meta, default: `system.getSystemMetaIfUserMetaNotExist`
     * @returns Context
     */
    MoleculerLib.createContext = (service, type, name, meta = {}) => {
        let typeName = {};
        if (type === "action") {
            typeName = { action: { name } };
        }
        if (type === "event") {
            typeName = { event: { name } };
        }
        const ctx = new service.broker.ContextFactory(service.broker, Object.assign({
            broker: service.broker,
            id: service.broker.nodeID,
            node: {},
            local: true,
            state: true,
            service,
            meta: system_1.system.getSystemMetaIfUserMetaNotExist(meta),
        }, typeName));
        return ctx;
    };
    /**
     * Create an local moleculer service
     */
    MoleculerLib.createLocalService = (broker, schema, schemaMods) => {
        return broker.createService(schema, schemaMods);
    };
    /**
     * Get an local moleculer service
     */
    MoleculerLib.getLocalService = (broker, name) => {
        return broker.getLocalService(name);
    };
})(MoleculerLib = exports.MoleculerLib || (exports.MoleculerLib = {}));
//# sourceMappingURL=moleculer.lib.js.map