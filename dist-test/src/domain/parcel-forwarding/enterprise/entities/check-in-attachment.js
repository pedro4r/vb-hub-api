"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckInAttachment = void 0;
const entity_1 = require("../../../../core/entities/entity");
class CheckInAttachment extends entity_1.Entity {
    get checkInId() {
        return this.props.checkInId;
    }
    get attachmentId() {
        return this.props.attachmentId;
    }
    static create(props, id) {
        const checkInAttachment = new CheckInAttachment(props, id);
        return checkInAttachment;
    }
}
exports.CheckInAttachment = CheckInAttachment;
//# sourceMappingURL=check-in-attachment.js.map