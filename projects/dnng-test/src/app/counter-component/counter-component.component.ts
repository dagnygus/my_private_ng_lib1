import { ContentInnerCounterComponent } from './../content-inner-counter/content-inner-counter.component';
import { InnerCounterComponent } from './../inner-counter/inner-counter.component';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, NgZone, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DnngComponentBase } from 'projects/dnng/src/public-api';
import { SomeTestingDirDirective } from '../directives/some-testing-dir.directive';

@Component({
  selector: 'app-counter-component',
  templateUrl: './counter-component.component.html',
  styleUrls: ['./counter-component.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: DnngComponentBase, useExisting: CounterComponent }]
})
export class CounterComponent extends DnngComponentBase{

  count = 0;
  doCheckCount = 0;

  @ViewChild(InnerCounterComponent) innerCounterComponent: InnerCounterComponent | null = null;
  @ViewChild(ContentInnerCounterComponent) contentInnderCounterComponent: ContentInnerCounterComponent | null = null;
  @ViewChildren(SomeTestingDirDirective) directiveList: QueryList<SomeTestingDirDirective> | null = null;

  constructor(cd: ChangeDetectorRef,
              ngz: NgZone) {
    super(cd, ngz);
  }

  increment(): void {
    this.count++;
    this._detectChangesLocaly();
  }


  decrement(): void {
    this.count--;
    this._detectChangesLocaly();
  }

  inproperInceremant(): void {
    for (let i = 1; i <= 10; i++) {
      this.count++;
      this._detectChangesLocaly();
    }
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngDoCheck(): void {
    this.doCheckCount++;
  }

}
