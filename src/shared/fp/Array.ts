export const map: <A, B>(f: (a: A) => B) => (fa: Array<A>) => Array<B> = (
  f,
) => (fa) => fa.map((a) => f(a))

export const mapWithIndex: <A, B>(
  f: (i: number, a: A) => B,
) => (fa: Array<A>) => Array<B> = (f) => (fa) => fa.map((a, i) => f(i, a))

export const addToEmpty = <A extends unknown>(a: A) => () => [a]

export const append: <A>(a: A) => (init: Array<A>) => Array<A> = (a) => (
  init,
) => [...init, a]
