import { Runnable } from 'mocha'

declare global {
    namespace Cypress {
        // Type for uncaught:exception handler
        type UncaughtExceptionCallback = (
            err: Error,
            runnable: Runnable
        ) => boolean | void

        // Custom options in Cypress.config()
        interface ResolvedConfigOptions {
            hideXHRAndFetch?: boolean
            hideUncaughtExc?: boolean
        }
    }
}