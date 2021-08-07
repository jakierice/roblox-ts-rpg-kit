import { CoreHooks } from "@rbxts/roact-hooks"
import { Eq } from "shared/fp-ts"

export function useStable<T>(value: T, E: Eq.Eq<T>, hooks: CoreHooks): T {
  const ref = hooks.useValue<T>(value)
  if (!E.equals(ref.value, value)) {
    ref.value = value
  }
  return ref.value
}

/**
 * Replacement for useEffect that accepts an IO-based effectful computation, and
 * Eq-backed dependencies.
 */
export const useIO = <T extends Array<unknown>>(
  io: () => void,
  dependencies: T,
  eq: Eq.Eq<T>,
  hooks: CoreHooks
) => {
  const deps = useStable(dependencies, eq, hooks)

  hooks.useEffect(() => {
    io()
  }, deps)
}
