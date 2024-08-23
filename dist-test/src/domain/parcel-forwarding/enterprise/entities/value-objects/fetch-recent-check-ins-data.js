"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchRecentCheckInsData = void 0;
const value_object_1 = require("../../../../../core/entities/value-object");
class FetchRecentCheckInsData extends value_object_1.ValueObject {
    get checkIns() {
        return this.props.checkIns;
    }
    get meta() {
        return this.props.meta;
    }
    static create(props) {
        return new FetchRecentCheckInsData(props);
    }
}
exports.FetchRecentCheckInsData = FetchRecentCheckInsData;
//# sourceMappingURL=fetch-recent-check-ins-data.js.map