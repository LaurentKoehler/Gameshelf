// Adds jest-dom matchers (toBeInTheDocument, etc.) to Vitest's expect.
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// React Testing Library's automatic cleanup only registers itself when
// `afterEach` is a global (i.e. Vitest's `test.globals: true`), which this
// project doesn't enable. Without this, DOM nodes from one test's render()
// leak into the next test in the same file.
afterEach(() => {
  cleanup()
})
