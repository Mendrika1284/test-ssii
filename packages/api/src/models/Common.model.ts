type Nullable<T> = T | null;
export type RequireField<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
export type PartialField<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type NullableField<T, K extends keyof T> = Omit<T, K> & { [P in K]+?: Nullable<T[P]> };
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

/**
 * `Verified` — Degree of validity of an information
 */
export type Verified = "waiting" | "confirmed" | "pending" | "invalid";

/**
 * A container for paginated lists of objects.
 * The array of objects is on the `.data` property,
 * and `.has_more` indicates whether there are additional objects beyond the end of this list.
 *
 */
export interface ApiList<T> {
  // object: string;

  data: Array<T>;

  //True if this list has another page of items after this one that can be fetched.
  hasMore: boolean;

  totalDocs: number;

  limit: number; // Maximum of objects that server can return
}

export type OneOf<
  T1,
  T2,
  T3 = undefined,
  T4 = undefined,
  T5 = undefined,
  T6 = undefined,
  T7 = undefined,
  T8 = undefined,
  T9 = undefined,
  T10 = undefined,
  T11 = undefined,
  T12 = undefined,
  T13 = undefined,
  T14 = undefined,
  T15 = undefined,
  T16 = undefined,
  T17 = undefined,
  T18 = undefined,
  T19 = undefined,
  T20 = undefined
> =
  | (T1 &
      Partial<
        Record<
          Exclude<
            | keyof T2
            | keyof T3
            | keyof T4
            | keyof T5
            | keyof T6
            | keyof T7
            | keyof T8
            | keyof T9
            | keyof T10
            | keyof T11
            | keyof T12
            | keyof T13
            | keyof T14
            | keyof T15
            | keyof T16
            | keyof T17
            | keyof T18
            | keyof T19
            | keyof T20,
            keyof T1
          >,
          never
        >
      >)
  | (T2 &
      Partial<
        Record<
          Exclude<
            | keyof T1
            | keyof T3
            | keyof T4
            | keyof T5
            | keyof T6
            | keyof T7
            | keyof T8
            | keyof T9
            | keyof T10
            | keyof T11
            | keyof T12
            | keyof T13
            | keyof T14
            | keyof T15
            | keyof T16
            | keyof T17
            | keyof T18
            | keyof T19
            | keyof T20,
            keyof T2
          >,
          never
        >
      >)
  | (T3 &
      Partial<
        Record<
          Exclude<
            | keyof T1
            | keyof T2
            | keyof T4
            | keyof T5
            | keyof T6
            | keyof T7
            | keyof T8
            | keyof T9
            | keyof T10
            | keyof T11
            | keyof T12
            | keyof T13
            | keyof T14
            | keyof T15
            | keyof T16
            | keyof T17
            | keyof T18
            | keyof T19
            | keyof T20,
            keyof T3
          >,
          never
        >
      >)
  | (T4 &
      Partial<
        Record<
          Exclude<
            | keyof T1
            | keyof T2
            | keyof T3
            | keyof T5
            | keyof T6
            | keyof T7
            | keyof T8
            | keyof T9
            | keyof T10
            | keyof T11
            | keyof T12
            | keyof T13
            | keyof T14
            | keyof T15
            | keyof T16
            | keyof T17
            | keyof T18
            | keyof T19
            | keyof T20,
            keyof T4
          >,
          never
        >
      >)
  | (T5 &
      Partial<
        Record<
          Exclude<
            | keyof T1
            | keyof T2
            | keyof T3
            | keyof T4
            | keyof T6
            | keyof T7
            | keyof T8
            | keyof T9
            | keyof T10
            | keyof T11
            | keyof T12
            | keyof T13
            | keyof T14
            | keyof T15
            | keyof T16
            | keyof T17
            | keyof T18
            | keyof T19
            | keyof T20,
            keyof T5
          >,
          never
        >
      >)
  | (T6 &
      Partial<
        Record<
          Exclude<
            | keyof T1
            | keyof T2
            | keyof T3
            | keyof T4
            | keyof T5
            | keyof T7
            | keyof T8
            | keyof T9
            | keyof T10
            | keyof T11
            | keyof T12
            | keyof T13
            | keyof T14
            | keyof T15
            | keyof T16
            | keyof T17
            | keyof T18
            | keyof T19
            | keyof T20,
            keyof T6
          >,
          never
        >
      >)
  | (T7 &
      Partial<
        Record<
          Exclude<
            | keyof T1
            | keyof T2
            | keyof T3
            | keyof T4
            | keyof T5
            | keyof T6
            | keyof T8
            | keyof T9
            | keyof T10
            | keyof T11
            | keyof T12
            | keyof T13
            | keyof T14
            | keyof T15
            | keyof T16
            | keyof T17
            | keyof T18
            | keyof T19
            | keyof T20,
            keyof T7
          >,
          never
        >
      >)
  | (T8 &
      Partial<
        Record<
          Exclude<
            | keyof T1
            | keyof T2
            | keyof T3
            | keyof T4
            | keyof T5
            | keyof T6
            | keyof T7
            | keyof T9
            | keyof T10
            | keyof T11
            | keyof T12
            | keyof T13
            | keyof T14
            | keyof T15
            | keyof T16
            | keyof T17
            | keyof T18
            | keyof T19
            | keyof T20,
            keyof T8
          >,
          never
        >
      >)
  | (T9 &
      Partial<
        Record<
          Exclude<
            | keyof T1
            | keyof T2
            | keyof T3
            | keyof T4
            | keyof T5
            | keyof T6
            | keyof T7
            | keyof T8
            | keyof T10
            | keyof T11
            | keyof T12
            | keyof T13
            | keyof T14
            | keyof T15
            | keyof T16
            | keyof T17
            | keyof T18
            | keyof T19
            | keyof T20,
            keyof T9
          >,
          never
        >
      >)
  | (T10 &
      Partial<
        Record<
          Exclude<
            | keyof T1
            | keyof T2
            | keyof T3
            | keyof T4
            | keyof T5
            | keyof T6
            | keyof T7
            | keyof T8
            | keyof T9
            | keyof T11
            | keyof T12
            | keyof T13
            | keyof T14
            | keyof T15
            | keyof T16
            | keyof T17
            | keyof T18
            | keyof T19
            | keyof T20,
            keyof T10
          >,
          never
        >
      >)
  | (T11 &
      Partial<
        Record<
          Exclude<
            | keyof T1
            | keyof T2
            | keyof T3
            | keyof T4
            | keyof T5
            | keyof T6
            | keyof T7
            | keyof T8
            | keyof T9
            | keyof T10
            | keyof T12
            | keyof T13
            | keyof T14
            | keyof T15
            | keyof T16
            | keyof T17
            | keyof T18
            | keyof T19
            | keyof T20,
            keyof T11
          >,
          never
        >
      >)
  | (T12 &
      Partial<
        Record<
          Exclude<
            | keyof T1
            | keyof T2
            | keyof T3
            | keyof T4
            | keyof T5
            | keyof T6
            | keyof T7
            | keyof T8
            | keyof T9
            | keyof T10
            | keyof T11
            | keyof T13
            | keyof T14
            | keyof T15
            | keyof T16
            | keyof T17
            | keyof T18
            | keyof T19
            | keyof T20,
            keyof T12
          >,
          never
        >
      >)
  | (T13 &
      Partial<
        Record<
          Exclude<
            | keyof T1
            | keyof T2
            | keyof T3
            | keyof T4
            | keyof T5
            | keyof T6
            | keyof T7
            | keyof T8
            | keyof T9
            | keyof T10
            | keyof T11
            | keyof T12
            | keyof T14
            | keyof T15
            | keyof T16
            | keyof T17
            | keyof T18
            | keyof T19
            | keyof T20,
            keyof T13
          >,
          never
        >
      >)
  | (T14 &
      Partial<
        Record<
          Exclude<
            | keyof T1
            | keyof T2
            | keyof T3
            | keyof T4
            | keyof T5
            | keyof T6
            | keyof T7
            | keyof T8
            | keyof T9
            | keyof T10
            | keyof T11
            | keyof T12
            | keyof T13
            | keyof T15
            | keyof T16
            | keyof T17
            | keyof T18
            | keyof T19
            | keyof T20,
            keyof T14
          >,
          never
        >
      >)
  | (T15 &
      Partial<
        Record<
          Exclude<
            | keyof T1
            | keyof T2
            | keyof T3
            | keyof T4
            | keyof T5
            | keyof T6
            | keyof T7
            | keyof T8
            | keyof T9
            | keyof T10
            | keyof T11
            | keyof T12
            | keyof T13
            | keyof T14
            | keyof T16
            | keyof T17
            | keyof T18
            | keyof T19
            | keyof T20,
            keyof T15
          >,
          never
        >
      >)
  | (T16 &
      Partial<
        Record<
          Exclude<
            | keyof T1
            | keyof T2
            | keyof T3
            | keyof T4
            | keyof T5
            | keyof T6
            | keyof T7
            | keyof T8
            | keyof T9
            | keyof T10
            | keyof T11
            | keyof T12
            | keyof T13
            | keyof T14
            | keyof T15
            | keyof T17
            | keyof T18
            | keyof T19
            | keyof T20,
            keyof T16
          >,
          never
        >
      >)
  | (T17 &
      Partial<
        Record<
          Exclude<
            | keyof T1
            | keyof T2
            | keyof T3
            | keyof T4
            | keyof T5
            | keyof T6
            | keyof T7
            | keyof T8
            | keyof T9
            | keyof T10
            | keyof T11
            | keyof T12
            | keyof T13
            | keyof T14
            | keyof T15
            | keyof T16
            | keyof T18
            | keyof T19
            | keyof T20,
            keyof T17
          >,
          never
        >
      >)
  | (T18 &
      Partial<
        Record<
          Exclude<
            | keyof T1
            | keyof T2
            | keyof T3
            | keyof T4
            | keyof T5
            | keyof T6
            | keyof T7
            | keyof T8
            | keyof T9
            | keyof T10
            | keyof T11
            | keyof T12
            | keyof T13
            | keyof T14
            | keyof T15
            | keyof T16
            | keyof T17
            | keyof T19
            | keyof T20,
            keyof T18
          >,
          never
        >
      >)
  | (T19 &
      Partial<
        Record<
          Exclude<
            | keyof T1
            | keyof T2
            | keyof T3
            | keyof T4
            | keyof T5
            | keyof T6
            | keyof T7
            | keyof T8
            | keyof T9
            | keyof T10
            | keyof T11
            | keyof T12
            | keyof T13
            | keyof T14
            | keyof T15
            | keyof T16
            | keyof T17
            | keyof T18
            | keyof T20,
            keyof T19
          >,
          never
        >
      >)
  | (T20 &
      Partial<
        Record<
          Exclude<
            | keyof T1
            | keyof T2
            | keyof T3
            | keyof T4
            | keyof T5
            | keyof T6
            | keyof T7
            | keyof T8
            | keyof T9
            | keyof T10
            | keyof T11
            | keyof T12
            | keyof T13
            | keyof T14
            | keyof T15
            | keyof T16
            | keyof T17
            | keyof T18
            | keyof T19,
            keyof T20
          >,
          never
        >
      >);
