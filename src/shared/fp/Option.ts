import { t } from "@rbxts/t"
import { Either } from "./Either"
import { Lazy, Predicate, Refinement } from "./function"

export type Option<A> = { tag: "None" } | { tag: "Some"; value: A }

export type None = { tag: "None" }
export const none: None = {
  tag: "None",
}
export const isNone = <A>(ma: Option<A>): ma is None => ma.tag === "None"

export type Some<A> = { tag: "Some"; value: A }
export const some = <A>(a: A): Some<A> => ({
  tag: "Some",
  value: a,
})

export const isSome = <A>(ma: Option<A>): ma is Some<A> => ma.tag === "Some"

export const fold: <A, B>(
  onNone: () => B,
  onSome: (a: A) => B,
) => (option: Option<A>) => B = (onNone, onSome) => (option) =>
  isSome(option) ? onSome(option.value) : onNone()

export const fromNullable = <A extends unknown>(a: A): Option<A> =>
  a !== undefined && !t.none(a) ? (some(a) as Some<A>) : none

export function fromPredicate<A, B extends A>(
  refinement: Refinement<A, B>,
): (a: A) => Option<B>

export function fromPredicate<A>(predicate: Predicate<A>): (a: A) => Option<A>
export function fromPredicate<A>(predicate: Predicate<A>): (a: A) => Option<A> {
  return (a) => (predicate(a) ? some(a) : none)
}

export const map: <A, B>(f: (a: A) => B) => (fa: Option<A>) => Option<B> = (
  f,
) => (fa) => (isNone(fa) ? none : some(f(fa.value)))

export const chain: <A, B>(
  f: (a: A) => Option<B>,
) => (ma: Option<A>) => Option<B> = (f) => (ma) =>
  isNone(ma) ? none : f(ma.value)

export const getOrElseW = <B>(onNone: Lazy<B>) => <A>(ma: Option<A>): A | B =>
  isNone(ma) ? onNone() : ma.value

export const getOrElse: <A>(
  onNone: Lazy<A>,
) => (ma: Option<A>) => A = getOrElseW

export function getRight<E, A>(ma: Either<E, A>): Option<A> {
  return ma.tag === "Left" ? none : some(ma.right)
}

export const fromEither: <E, A>(ma: Either<E, A>) => Option<A> = getRight

export const toUndefined = <A>(ma: Option<A>): A | undefined =>
  isNone(ma) ? undefined : ma.value
