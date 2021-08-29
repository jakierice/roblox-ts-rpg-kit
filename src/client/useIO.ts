import { HookFunctions } from "@rbxts/roact-hooks"
import { Eq } from "shared/fp-ts"

export function useStable<T>(
  value: T,
  E: Eq.Eq<T>,
  useValue: HookFunctions["useValue"]
): T {
  const ref = useValue<T>(value)
  if (!E.equals(ref.value, value)) {
    ref.value = value
  }
  return ref.value
}

/**
 * Replacement for useEffect that accepts an IO-based effectful computation, and
 * Eq-backed dependencies.
 */
export const useIO =
  (
    useEffect: HookFunctions["useEffect"],
    useValue: HookFunctions["useValue"]
  ) =>
  <T extends Array<unknown>>(io: () => void, dependencies: T, eq: Eq.Eq<T>) => {
    const deps = useStable(dependencies, eq, useValue)

    useEffect(() => {
      io()
    }, deps)
  }

export const makeUseIO = (
  useEffect: HookFunctions["useEffect"],
  useValue: HookFunctions["useValue"]
) => useIO(useEffect, useValue)
