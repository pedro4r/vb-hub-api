"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchCustomerByNameData = void 0;
const value_object_1 = require("../../../../../core/entities/value-object");
class FetchCustomerByNameData extends value_object_1.ValueObject {
    get customers() {
        return this.props.customers;
    }
    get meta() {
        return this.props.meta;
    }
    static create(props) {
        return new FetchCustomerByNameData(props);
    }
}
exports.FetchCustomerByNameData = FetchCustomerByNameData;
//# sourceMappingURL=fetch-customers-by-name-data.js.map