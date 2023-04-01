import Spy = jasmine.Spy;
import Func = jasmine.Func;

export type Stub<T> = {
  [K in keyof T]: T[K] extends Func ? T[K] & Spy<T[K]> : T[K];
};
