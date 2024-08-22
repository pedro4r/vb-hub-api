"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckInAttachmentList = void 0;
const watched_list_1 = require("../../../../core/entities/watched-list");
class CheckInAttachmentList extends watched_list_1.WatchedList {
    compareItems(a, b) {
        return a.attachmentId.equals(b.attachmentId);
    }
}
exports.CheckInAttachmentList = CheckInAttachmentList;
//# sourceMappingURL=check-in-attachment-list.js.map