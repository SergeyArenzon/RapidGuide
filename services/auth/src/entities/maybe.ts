import type { MaybeNull } from './maybeNull';
import type { MaybeUndefined } from './maybeUndefined.js';

export type Maybe<T> = MaybeNull<T> | MaybeUndefined<T>;
