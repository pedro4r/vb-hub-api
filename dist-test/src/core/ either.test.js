"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const either_1 = require("./either");
function doSomeThing(shouldSuccess) {
    if (shouldSuccess) {
        return (0, either_1.right)(10);
    }
    else {
        return (0, either_1.left)('error');
    }
}
test('success result', () => {
    const result = doSomeThing(true);
    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
});
test('error result', () => {
    const result = doSomeThing(false);
    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
});
//# sourceMappingURL=%20either.test.js.map