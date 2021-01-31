import { Observable, Subject } from 'rxjs';
export type DeepReadonly<T extends object> = T extends Array<infer U1> ? ReadonlyArray<U1> : {
  readonly [Property in keyof T]: T[Property] extends number | string | boolean ?
                                  T[Property] :
                                  T[Property] extends Array<infer U2> ? ReadonlyArray<U2> :
                                  T[Property] extends ((...args: any[]) => any) ? never :
                                  T[Property] extends object ? DeepReadonly<T[Property]> :
                                  never
};

export interface StateManagerCommand<TParam = void> {
  (parameter?: TParam): void;
  canExecute: boolean;
  onCanExecuteChanged$: Observable<void>;
}

