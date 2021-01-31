import { DnngComponentBase } from 'projects/dnng/src/public-api';
import { Component, OnInit, ChangeDetectorRef, NgZone, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-inner-counter',
  templateUrl: './inner-counter.component.html',
  styleUrls: ['./inner-counter.component.css'],
  providers: [{ provide: DnngComponentBase, useExisting: InnerCounterComponent }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InnerCounterComponent extends DnngComponentBase {

  @Input() count = 0;
  doCheckCount = 0;

  constructor(cd: ChangeDetectorRef,
              ngz: NgZone) {
    super(cd, ngz);
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngDoCheck(): void {
    this.doCheckCount++;
  }

}
