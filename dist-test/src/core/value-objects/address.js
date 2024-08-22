"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
class Address {
    props;
    constructor(props) {
        this.props = props;
    }
    get address() {
        return this.props.address;
    }
    get complement() {
        return this.props.complement;
    }
    get city() {
        return this.props.city;
    }
    get state() {
        return this.props.state;
    }
    get zipcode() {
        return this.props.zipcode;
    }
    get country() {
        return this.props.country;
    }
    static create(props) {
        const address = new Address({
            ...props,
            complement: props.complement ?? null,
        });
        return address;
    }
}
exports.Address = Address;
//# sourceMappingURL=address.js.map