"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueObject = void 0;
class ValueObject {
    props;
    constructor(props) {
        this.props = props;
    }
    equals(vo) {
        if (vo === null || vo === undefined) {
            return false;
        }
        if (vo.props === undefined) {
            return false;
        }
        return JSON.stringify(vo.props) === JSON.stringify(this.props);
    }
}
exports.ValueObject = ValueObject;
//# sourceMappingURL=value-object.js.map