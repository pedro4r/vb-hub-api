export interface AddressProps {
  address: string
  complement?: string | null
  city: string
  state: string
  zipcode: string
  country: string
}

export class Address implements AddressProps {
  private props: AddressProps
  constructor(props: AddressProps) {
    this.props = props
  }

  get address() {
    return this.props.address
  }

  get complement() {
    return this.props.complement
  }

  get city() {
    return this.props.city
  }

  get state() {
    return this.props.state
  }

  get zipcode() {
    return this.props.zipcode
  }

  get country() {
    return this.props.country
  }

  static create(props: AddressProps) {
    const address = new Address({
      ...props,
      complement: props.complement ?? null,
    })

    return address
  }
}
