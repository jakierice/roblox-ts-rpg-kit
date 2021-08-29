import * as O from "./Option"
import * as Eq from "./Eq"
import { Predicate, Refinement } from "./function"

export const map: <A, B>(f: (a: A) => B) => (fa: Array<A>) => Array<B> =
  (f) => (fa) =>
    fa.map((a) => f(a))

export const filter: {
  <A, B extends A>(refinement: Refinement<A, B>): (fa: Array<A>) => Array<B>
  <A>(predicate: Predicate<A>): (fa: Array<A>) => Array<A>
} =
  <A>(predicate: Predicate<A>) =>
  (fa: Array<A>) =>
    fa.filter(predicate)

export const filterMapWithIndex =
  <A, B>(f: (i: number, a: A) => O.Option<B>) =>
  (fa: Array<A>): Array<B> => {
    const out: Array<B> = []
    for (let i = 0; i < fa.size(); i++) {
      const optionB = f(i, fa[i])
      if (O.isSome(optionB)) {
        out.push(optionB.value)
      }
    }
    return out
  }

export const filterMap: <A, B>(
  f: (a: A) => O.Option<B>
) => (fa: Array<A>) => Array<B> = (f) => filterMapWithIndex((_, a) => f(a))

export const mapWithIndex: <A, B>(
  f: (i: number, a: A) => B
) => (fa: Array<A>) => Array<B> = (f) => (fa) => fa.map((a, i) => f(i, a))

export const addToEmpty =
  <A extends unknown>(a: A) =>
  () =>
    [a]

export const append: <A>(a: A) => (init: Array<A>) => Array<A> =
  (a) => (init) =>
    [...init, a]

export const isEmpty: <A>(fa: Array<A>) => boolean = (fa) => fa.size() === 0
export const isNonEmpty: <A>(fa: Array<A>) => boolean = (fa) => fa.size() >= 1

export const getEq = <A>(E: Eq.Eq<A>): Eq.Eq<Array<A>> =>
  Eq.fromEquals(
    (xs, ys) =>
      xs.size() === ys.size() && xs.every((x, i) => E.equals(x, ys[i]))
  )
