import { DeepReadonly, StateManagerCommand } from './dnng.util.types';
import {  Observable, Subject, Subscription } from 'rxjs';
import { OnInit, OnDestroy } from '@angular/core';

export abstract class DnngStateManager<T extends object> implements OnInit, OnDestroy {

  // tslint:disable-next-line: variable-name
  private __dn_subscriptions__: Subscription[] = [];
  // tslint:disable-next-line: variable-name
  private __dn_internal_state__: T | null = null;
  // tslint:disable-next-line: variable-name
  private __dn_state_pending__ = false;
  // tslint:disable-next-line: variable-name
  private __dn_state_subcription__: Subscription | null = null;
  // tslint:disable-next-line: variable-name
  private __dn_on_state_changed$__ = new Subject();
  // tslint:disable-next-line: variable-name
  private __dn_failed_to_initial_state__ = false;
  // tslint:disable-next-line: variable-name
  private __dn_state_initialized__ = false;

  onStateChanged$ = this.__dn_on_state_changed$__.asObservable();

  get stateInitialized(): boolean {
    return this.__dn_state_initialized__;
  }

  get statePending(): boolean {
    return this.__dn_state_pending__;
  }

  get state(): DeepReadonly<T> {

    if (this.__dn_state_pending__) {
      throw new Error('Cannot read state if state manager is in pending mode!!!');
    }

    if (this.__dn_failed_to_initial_state__) {
      throw new Error('Cannot read state when state manager failed to load state!!!');
    }

    if (!this.__dn_state_initialized__) {
      throw new Error('Cannot read state if the state is not initialized');
    }

    return this.__dn_internal_state__ as any;
  }

  get failedToInitialState(): boolean {
    return this.__dn_failed_to_initial_state__;
  }

  constructor() {
    Object.defineProperty(this, '__dn_subscriptions__', {
      value: this.__dn_subscriptions__,
      enumerable: false
    });
    Object.defineProperty(this, '__dn_internal_state__', {
      value: this.__dn_internal_state__,
      writable: true,
      enumerable: false,
    });
    Object.defineProperty(this, '__dn_state_pending__', {
      value: this.__dn_state_pending__,
      enumerable: false,
      writable: true,
    });
    Object.defineProperty(this, '__dn_state_subcription__', {
      value: this.__dn_state_subcription__,
      enumerable: false,
      writable: true,
    });
    Object.defineProperty(this, '__dn_on_state_changed$__', {
      value: this.__dn_on_state_changed$__,
      enumerable: false,
    });
    Object.defineProperty(this, '__dn_failed_to_initial_state__', {
      value: this.__dn_failed_to_initial_state__,
      enumerable: false,
      writable: true,
    });
    Object.defineProperty(this, '__dn_state_initialized__', {
      value: this.__dn_state_initialized__,
      enumerable: false,
      writable: true
    });
  }

  protected abstract provideInitialState(): T | Promise<T> | Observable<T> | null;

  ngOnDestroy(): void {
    this.__dn_state_subcription__?.unsubscribe();
    for (const subscription of this.__dn_subscriptions__) {
      subscription.unsubscribe();
    }
  }
  ngOnInit(): void {
    this.__dn_initial_state__();
  }

  notifyStateChanged(): void {
    this.__dn_on_state_changed$__.next();
  }

  protected tryLoadStateAgain(): void {
    this.__dn_failed_to_initial_state__ = false;
    this.__dn_initial_state__();
  }

  protected reinitialState(currnetState: T | null, newState: T): void {
    if (currnetState === this.__dn_internal_state__) {
      this.__dn_internal_state__ = newState;
      if (currnetState === null) {
        this.__dn_state_initialized__ = true;
      }
    } else {
      throw new Error('State manipulation is only allow in command body');
    }
  }

  // tslint:disable-next-line: max-line-length
  protected defineCommand<TParam>(canExecute: boolean, execute: (state: T | null, parameter?: TParam) => void): StateManagerCommand<TParam> {
    const self = this;
    // tslint:disable-next-line: only-arrow-functions tslint:disable-next-line: prefer-const
    let command: any = function(parameter?: TParam): void {
      if (command.canExecute && !self.__dn_state_pending__ && !self.__dn_failed_to_initial_state__) {
        execute(self.__dn_internal_state__, parameter);
      }
    };

    Object.defineProperty(command, '__dn_can_execute_changed$__', {
      value: new Subject<void>(),
      enumerable: false
    });

    Object.defineProperty(command, '__dn_can_execute__', {
      value: canExecute,
      enumerable: false,
      writable: true
    });

    Object.defineProperty(command, 'canExecute', {
      get(): boolean {
        return this.__dn_can_execute__;
      },
      set(value: boolean): void {
        if (value !== this.__dn_can_execute__) {
          this.__dn_can_execute__ = value;
          this.__dn_can_execute_changed$__.next();
        }
      }
    });

    command.onCanExecuteChanged$ = command.__dn_can_execute_changed$__.asObservable();

    return command as StateManagerCommand<TParam>;
  }

  private __dn_initial_state__(): void {
    const initialState = this.provideInitialState();

    if (initialState instanceof Promise) {
      this.__dn_state_pending__ = true;
      initialState.then((providedState) => {
        this.__dn_internal_state__ = providedState;
        this.__dn_state_pending__ = false;
        this.__dn_state_initialized__ = true;
        this.notifyStateChanged();
      }).catch((error) => {
        console.error(error);
        this.__dn_state_pending__ = false;
        this.__dn_failed_to_initial_state__ = true;
        this.notifyStateChanged();
      });
      return;
    } else if (initialState instanceof Observable) {
      this.__dn_state_pending__ = true;
      this.__dn_state_subcription__ = initialState.subscribe({
        next: (providedSate) => {
          this.__dn_internal_state__ = providedSate;
          this.__dn_state_pending__ = false;
          this.__dn_state_initialized__ = true;
          this.notifyStateChanged();
        },
        error: (error) => {
          console.error(error);
          this.__dn_state_pending__ = false;
          this.__dn_failed_to_initial_state__ = true;
          this.notifyStateChanged();
        },
        complete: () => {
          if (!this.__dn_internal_state__) {
            this.__dn_state_pending__ = false;
            this.__dn_failed_to_initial_state__ = true;
            this.notifyStateChanged();
          }
        }
      });
      return;
    } else {
      this.__dn_internal_state__ = initialState;
      if (this.__dn_initial_state__ !== null) {
        this.__dn_state_initialized__ = true;
      }
    }
  }
}
