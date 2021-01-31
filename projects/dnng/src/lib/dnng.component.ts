import { AfterViewChecked, ChangeDetectorRef, Component, NgZone, OnChanges, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

// tslint:disable-next-line: no-conflicting-lifecycle
@Component({
  template: ''
})
// tslint:disable-next-line: component-class-suffix
export abstract class DnngComponentBase implements AfterViewChecked, OnChanges, OnDestroy {

  // tslint:disable-next-line: variable-name
  private __dn_async_cd_subscription__: Subscription | null = null;
  // tslint:disable-next-line: variable-name
  private __dn_marked_to_check_localy__ = false;
  // tslint:disable-next-line: variable-name
  private __dn_subscriptions__: Subscription[] = [];

  // tslint:disable-next-line: variable-name
  constructor(protected _changeDetectorRef: ChangeDetectorRef,
              // tslint:disable-next-line: variable-name
              protected _ngZone: NgZone) { }

  protected _detectChangesLocaly(): void {
    if (!this.__dn_marked_to_check_localy__) {
      this.__dn_marked_to_check_localy__ = true;
      this.__dn_async_cd_subscription__ = this._ngZone.onStable.subscribe(() => {
        this._changeDetectorRef.detectChanges();
        this._cancelChangeDetecton();
      });
    }
  }

  protected _cancelChangeDetecton(): void {
    if (this.__dn_marked_to_check_localy__) {
      this.__dn_marked_to_check_localy__ = false;
      this.__dn_async_cd_subscription__?.unsubscribe();
      this.__dn_async_cd_subscription__ = null;
    }
  }

  ngOnChanges(): void {
    this._changeDetectorRef.reattach();
    this._cancelChangeDetecton();
  }

  ngAfterViewChecked(): void {
    this._changeDetectorRef.detach();
  }

  ngOnDestroy(): void {
    this.__dn_async_cd_subscription__?.unsubscribe();
    for (const subscription of this.__dn_subscriptions__) {
      subscription.unsubscribe();
    }
  }
}
