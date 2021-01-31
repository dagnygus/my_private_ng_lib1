import { ContentInnerCounterComponent } from './../content-inner-counter/content-inner-counter.component';
import { InnerCounterComponent } from './../inner-counter/inner-counter.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterComponent } from './counter-component.component';
import { SomeTestingDirDirective } from '../directives/some-testing-dir.directive';

let description = 'CounterComponent: Clickig increment button';

describe(description, () => {
  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;
  let counterElement: HTMLElement;
  let incrementButton: HTMLButtonElement;
  let decrementButton: HTMLButtonElement;
  let countBox: HTMLElement;
  let innerCountBox: HTMLElement;
  let contentInnerCountBox: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CounterComponent,
        InnerCounterComponent,
        ContentInnerCounterComponent
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentInstance;
    counterElement = fixture.nativeElement;
    innerCountBox = counterElement.querySelector('#inner-count-box')! as HTMLElement;
    contentInnerCountBox = counterElement.querySelector('#content-inner-count-box')! as HTMLElement;
    incrementButton = counterElement.querySelector('#incrememtButton')! as HTMLButtonElement;
    decrementButton = counterElement.querySelector('#decrementButton')! as HTMLButtonElement;
    countBox = counterElement.querySelector('#countBox')! as HTMLElement;
    fixture.detectChanges();

    incrementButton.dispatchEvent(new Event('click'));
  });

  it('should update property count', () => {
    expect(component.count).toEqual(1);
  });
  it('should update Dom', () => {
    expect(countBox.textContent?.trim()).toEqual('1');
  });
  it('should update count in inner-counter-component', () => {
    expect(component.innerCounterComponent!.count).toEqual(1);
  });
  it('should update DOM in inner-counter-component', () => {
    expect(innerCountBox.textContent?.trim()).toEqual('1');
  });
  it('should update DOM in content-inner-counter-component', () => {
    expect(contentInnerCountBox.textContent?.trim()).toEqual('1');
  });
});

description = 'CounterComponent: Clicking button whot increment counter ten times and trigger localChangeDetection ten times';

describe(description, () => {
  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;
  let counterElement: HTMLElement;
  let incrementTenTimesButton: HTMLButtonElement;
  let countBox: HTMLElement;
  let innerCountBox: HTMLElement;
  let contentInnerCountBox: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CounterComponent,
        InnerCounterComponent,
        ContentInnerCounterComponent
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentInstance;
    counterElement = fixture.nativeElement;
    innerCountBox = counterElement.querySelector('#inner-count-box')! as HTMLElement;
    contentInnerCountBox = counterElement.querySelector('#content-inner-count-box')! as HTMLElement;
    incrementTenTimesButton = counterElement.querySelector('#incrementTenTimesButton')! as HTMLButtonElement;
    countBox = counterElement.querySelector('#countBox')! as HTMLElement;
    fixture.detectChanges();
    incrementTenTimesButton.dispatchEvent(new Event('click'));
  });

  it('should update count property up to ten', () => {
    expect(component.count).toEqual(10);
  });
  it('should update the dom', () => {
    expect(countBox.textContent?.trim()).toEqual('10');
  });
  it('should checked component one time', () => {
    expect(component.doCheckCount).toEqual(1);
  });
  it('should update count property in inner-counter-component up to ten', () => {
    expect(component.innerCounterComponent?.count).toEqual(10);
  });
  it('shoul update the DOM in inner-counter-component', () => {
    expect(innerCountBox.textContent?.trim()).toEqual('10');
  });
  it('inner-counter-component should be checked two times', () => {
    expect(component.innerCounterComponent?.doCheckCount).toEqual(2);
  });
  it('should update the dom in content-inner-counter-component', () => {
    expect(contentInnerCountBox.textContent?.trim()).toEqual('10');
  });
  it('content-inner-counter-component should be checked two times', () => {
    expect(component.contentInnderCounterComponent?.doCheckCount).toEqual(2);
  });
});

description = 'CounterComponent: Checking correct behavior in custom directive';

describe(description, () => {
  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CounterComponent,
        InnerCounterComponent,
        ContentInnerCounterComponent,
        SomeTestingDirDirective
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

  });

  it('first instace of custom directive should contain instance of CounterComponent', () => {
    expect(component.directiveList?.first.hostComponent instanceof CounterComponent).toEqual(true);
  });

  it('second instace of custom directive should contain instance of InnerCounterComponent', () => {
    expect(component.directiveList?.last.hostComponent instanceof InnerCounterComponent).toEqual(true);
  });

});

