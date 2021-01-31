import { DnngComponentBase } from 'projects/dnng/src/public-api';
import { Directive } from '@angular/core';

@Directive({
  selector: '[appSomeTestingDir]'
})
export class SomeTestingDirDirective {

  constructor(public hostComponent: DnngComponentBase) { }

}
