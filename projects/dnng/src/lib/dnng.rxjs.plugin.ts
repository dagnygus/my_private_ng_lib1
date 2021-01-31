import { DnngStateManager } from 'projects/dnng/src/lib/dnng.state.manager';
import { DnngComponentBase } from 'projects/dnng/src/lib/dnng.component';
import { Observable, PartialObserver, Subscription } from 'rxjs';

(Observable.prototype as any).listen = function(this: Observable<any>,
                                                context: DnngComponentBase | DnngStateManager<any>,
                                                observer: PartialObserver<any> |
                                                          ((...args: [arg: any] | []) => void)): Subscription   {
  const subcription = this.subscribe(observer as PartialObserver<any>);
  ((context as any).__dn_subscriptions__ as Array<Subscription>).push(subcription);
  const originalUnsubcribe = subcription.unsubscribe;
  subcription.unsubscribe = function(this: Subscription): void {
    const index = ((context as any).__dn_subscriptions__ as Array<Subscription>).indexOf(subcription);
    ((context as any).__dn_subscriptions__ as Array<Subscription>).splice(index);
    originalUnsubcribe.call(this);
  };
  return subcription;
};

// tslint:disable-next-line: only-arrow-functions
(Observable.prototype as any).listenOnce = function(this: Observable<any>,
                                                    context: DnngComponentBase | DnngStateManager<any>,
                                                    observer: PartialObserver<any> |
                                                              ((...args: [arg: any] | []) => void)): Subscription {
  let subcription: Subscription;
  let originalUnsubcribe: () => void;
  if (typeof observer === 'function') {
    subcription = this.subscribe((_) => {
      observer(_);
      subcription.unsubscribe();
      const index = ((context as any).__dn_subscriptions__ as Array<Subscription>).indexOf(subcription);
      if (index >= 0) {
          ((context as any).__dn_subscriptions__ as Array<Subscription>).splice(index);
      }
    });
    ((context as any).__dn_subscriptions__ as Array<Subscription>).push(subcription);
    originalUnsubcribe = subcription.unsubscribe;
    subcription.unsubscribe = function(this: Subscription): void {
      const index = ((context as any).__dn_subscriptions__ as Array<Subscription>).indexOf(subcription);
      ((context as any).__dn_subscriptions__ as Array<Subscription>).splice(index);
      originalUnsubcribe.call(subcription);
    };
    return subcription;
  }

  subcription = this.subscribe(observer);
  ((context as any).__dn_subscriptions__ as Array<Subscription>).push(subcription);
  originalUnsubcribe = subcription.unsubscribe;
  subcription.unsubscribe = function(this: Subscription): void {
      const index = ((context as any).__dn_subscriptions__ as Array<Subscription>).indexOf(subcription);
      if (index >= 0) {
        ((context as any).__dn_subscriptions__ as Array<Subscription>).splice(index);
      }
      originalUnsubcribe.call(this);
  };

  const originalNext = observer.next;
  const originalComplate = observer.complete;
  const originalError = observer.error;
  if (originalComplate) {
    observer.complete = function(this: PartialObserver<any>): void {
      const index = ((context as any).__dn_subscriptions__ as Array<Subscription>).indexOf(subcription);
      if (index >= 0) {
        ((context as any).__dn_subscriptions__ as Array<Subscription>).splice(index);
      }
      originalUnsubcribe.call(subcription);
      originalComplate!.call(this);
    };
  }
  if (originalNext) {
    observer.next = function(this: PartialObserver<any>, value: any): void {
      const index = ((context as any).__dn_subscriptions__ as Array<Subscription>).indexOf(subcription);
      if (index >= 0) {
        ((context as any).__dn_subscriptions__ as Array<Subscription>).splice(index);
      }
      originalUnsubcribe.call(subcription);
      originalNext!.call(this, value);
    };
  }
  if (originalError) {
    observer.error = function(this: PartialObserver<any>, error: any): void {
      const index = ((context as any).__dn_subscriptions__ as Array<Subscription>).indexOf(subcription);
      if (index >= 0) {
        ((context as any).__dn_subscriptions__ as Array<Subscription>).splice(index);
      }
      originalUnsubcribe.call(subcription);
      originalError!.call(this, error);
    };
  }
  return subcription;
};
