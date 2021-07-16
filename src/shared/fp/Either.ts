import { bind_, bindTo_, pipe } from "./function"
import { t } from "@rbxts/t"

export {}
export type Either<E, A> = { tag: "Left"; left: E } | { tag: "Right"; right: A }
export type Left<E> = Either<E, never>
export type Right<A> = Either<never, A>
export const left = <E>(e: E): Left<E> => ({
  tag: "Left",
  left: e,
})
export const isLeft = <E, A>(ma: Either<E, A>): ma is Left<E> =>
  ma.tag === "Left"

export const right = <A>(a: A): Right<A> => ({
  tag: "Right",
  right: a,
})
export const isRight = <E, A>(ma: Either<E, A>): ma is Right<A> =>
  ma.tag === "Right"

export const fold = <E, A, R>(onLeft: (e: E) => R, onRight: (a: A) => R) => (
  either: Either<E, A>
): R => {
  switch (either.tag) {
    case "Right":
      return onRight(either.right)
    case "Left":
      return onLeft(either.left)
  }
}

export const map = <E, A, B>(f: (a: A) => B) => (
  fa: Either<E, A>
): Either<E, B> => (fa.tag === "Left" ? fa : right(f(fa.right)))

export const mapLeft: <E, G>(
  f: (e: E) => G
) => <A>(fa: Either<E, A>) => Either<G, A> = (f) => (fa) =>
  isLeft(fa) ? left(f(fa.left)) : fa

export const chainW = <D, A, B>(f: (a: A) => Either<D, B>) => <E>(
  ma: Either<E, A>
): Either<D | E, B> => (isLeft(ma) ? ma : f(ma.right))

export const chain: <E, A, B>(
  f: (a: A) => Either<E, B>
) => (ma: Either<E, A>) => Either<E, B> = chainW

export const bindTo = <N extends string>(
  name: N
): (<E, A>(fa: Either<E, A>) => Either<E, { [K in N]: A }>) =>
  map(bindTo_(name))

export const bindW = <N extends string, A, D, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => Either<D, B>
): (<E>(
  fa: Either<E, A>
) => Either<D | E, { [K in keyof A | N]: K extends keyof A ? A[K] : B }>) =>
  chainW((a) =>
    pipe(
      f(a),
      map((b) => bind_(a, name, b))
    )
  )

export const bind: <N extends string, A, E, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => Either<E, B>
) => (
  fa: Either<E, A>
) => Either<E, { [K in keyof A | N]: K extends keyof A ? A[K] : B }> = bindW

export const opCall: <A>(fn: () => A) => Either<string, A> = (fn) => {
  const result = opcall(fn)
  return result.success ? right(result.value) : left(result.error)
}

export const decode: <A>(d: t.check<A>) => (a: unknown) => Either<string, A> = (
  d
) => (a) =>
  d(a) ? right(a) : left(`Decode error: type of ${a} does not meet t.check.`)
