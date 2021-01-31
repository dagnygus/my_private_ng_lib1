import { DnngComponentBase } from 'projects/dnng/src/public-api';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';

@Component({
  selector: 'app-content-inner-counter',
  templateUrl: './content-inner-counter.component.html',
  styleUrls: ['./content-inner-counter.component.css'],
  providers: [{ provide: DnngComponentBase, useExisting: ContentInnerCounterComponent }],
  // viewProviders: [{ provide: DnngComponentBase, useExisting: ContentInnerCounterComponent }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentInnerCounterComponent extends DnngComponentBase {

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
