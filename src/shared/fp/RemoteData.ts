import * as E from "./Either"
import * as O from "./Option"
export type Initial = { tag: "Initial" }
export const initial: Initial = { tag: "Initial" }

export type Pending = { tag: "Pending" }
export const pending: Pending = { tag: "Pending" }

export type Failure<E> = { tag: "Failure"; error: E }
export const failure: <E>(e: E) => Failure<E> = (e) => ({
  tag: "Failure",
  error: e,
})

export type Success<A> = { tag: "Success"; value: A }
export const success: <A>(a: A) => Success<A> = (a) => ({
  tag: "Success",
  value: a,
})

export type RemoteData<E, A> = Initial | Pending | Failure<E> | Success<A>

interface RemoteDataMatchers<E, A, D> {
  initial: () => D
  pending: () => D
  failure: (e: E) => D
  success: (a: A) => D
}

export const fold: <E, A, D>(
  m: RemoteDataMatchers<E, A, D>,
) => (rd: RemoteData<E, A>) => D = (m) => (rd) => {
  switch (rd.tag) {
    case "Initial":
      return m.initial()
    case "Pending":
      return m.pending()
    case "Failure":
      return m.failure(rd.error)
    case "Success":
      return m.success(rd.value)
  }
}

export const fromOption: <E, A>(
  onNone: () => E,
) => (o: O.Option<A>) => RemoteData<E, A> = (onNone) => (ma) =>
  O.isNone(ma) ? failure(onNone()) : success(ma.value)

export const fromEither: <E, A>(e: E.Either<E, A>) => RemoteData<E, A> = (e) =>
  E.isLeft(e) ? failure(e.left) : success(e.right)
