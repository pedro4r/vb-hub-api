"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitFor = waitFor;
async function waitFor(assertions, maxDuration = 1000) {
    return new Promise((resolve, reject) => {
        let elapsedTime = 0;
        const interval = setInterval(async () => {
            elapsedTime += 10;
            try {
                await assertions();
                clearInterval(interval);
                resolve();
            }
            catch (err) {
                if (elapsedTime >= maxDuration) {
                    reject(err);
                }
            }
        }, 10);
    });
}
//# sourceMappingURL=wait-for.js.map