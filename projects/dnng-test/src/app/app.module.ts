import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CounterComponent } from './counter-component/counter-component.component';
import { InnerCounterComponent } from './inner-counter/inner-counter.component';
import { ContentInnerCounterComponent } from './content-inner-counter/content-inner-counter.component';
import { SomeTestingDirDirective } from './directives/some-testing-dir.directive';
import { PersonComponent } from './person/person.component';

@NgModule({
  declarations: [
    AppComponent,
    CounterComponent,
    InnerCounterComponent,
    ContentInnerCounterComponent,
    SomeTestingDirDirective,
    PersonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
