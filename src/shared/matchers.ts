/**
 * Extracts the type of a member of a tagged union
 *
 * @example
 * import { TaggedUnionMember } from 'typelevel-ts'
 *
 * type A = { tag: 'A'; a: string }
 * type B = { tag: 'B'; b: number }
 * type C = A | B
 * export type Result = TaggedUnionMember<C, 'tag', 'A'> // A
 *
 * @since 0.3.0
 */
export type TaggedUnionMember<
  A extends object,
  Tag extends keyof A,
  Value extends A[Tag],
> = Extract<A, Record<Tag, Value>>

type TaggedOnKey<K extends string> = { [k in K]: string }

/**
 * An object whose properties are the values of a tagged union's discriminant,
 * and whose values are functions taking the corresponding tagged union member
 * and returning an `Out`.
 */
type Matchers<Key extends string, TaggedUnion extends TaggedOnKey<Key>, Out> = {
  [D in TaggedUnion[Key]]: (v: TaggedUnionMember<TaggedUnion, Key, D>) => Out
}

export type Match<K extends string> = <TU extends TaggedOnKey<K>, Z>(
  matchObj: Matchers<K, TU, Z>,
) => (tu: TU) => Z

export const matchOnKey =
  <K extends string>(key: K): Match<K> =>
  <TaggedUnion extends TaggedOnKey<K>, Z>(
    matchObj: Matchers<K, TaggedUnion, Z>,
  ) =>
  (tu: TaggedUnion): Z =>
    matchObj[tu[key]](tu as TaggedUnionMember<TaggedUnion, K, typeof tu[K]>)

export const match = matchOnKey('tag')
