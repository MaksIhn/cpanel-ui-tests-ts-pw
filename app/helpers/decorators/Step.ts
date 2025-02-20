import test from "@playwright/test"


export function step(stepName?: string) {

    return function decorator(
      target: Function,
      context: ClassMethodDecoratorContext
    ) {
      return function replacementMethod(...args: any) {

        const name = stepName || `${this.constructor.name + "." + (context.name as string)}`
        return test.step(name, async () => {
          return await target.call(this, ...args)
        })
      }
    }
  }