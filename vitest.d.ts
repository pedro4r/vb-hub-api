declare global {
  namespace ExpectGlobal {
    interface Matchers<R> {
      toBeArrayOfSize(length: number): R
    }
  }
}
