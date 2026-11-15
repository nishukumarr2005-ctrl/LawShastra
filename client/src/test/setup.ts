import '@testing-library/jest-dom/vitest'
import * as matchers from '@testing-library/jest-dom/matchers'

// @ts-expect-error global expect in vitest globals mode
if (typeof expect !== 'undefined' && expect.extend) {
  // @ts-expect-error matchers object
  expect.extend(matchers)
}

if (!globalThis.DOMMatrix) {
  class DOMMatrixMock {
    value: string

    static fromMatrix() {
      return new DOMMatrixMock()
    }

    constructor(value: string = '1, 0, 0, 1, 0, 0') {
      this.value = value
    }

    multiply() {
      return this
    }

    translate() {
      return this
    }

    scale() {
      return this
    }

    skewX() {
      return this
    }

    skewY() {
      return this
    }

    rotate() {
      return this
    }

    inverse() {
      return this
    }

    toString() {
      return this.value
    }
  }

  // @ts-expect-error jsdom does not expose DOMMatrix in the test runtime
  globalThis.DOMMatrix = DOMMatrixMock
}

if (typeof window !== 'undefined') {
  window.scrollTo = () => undefined
}
