import { fakeAsync, tick } from '@angular/core/testing';
import { DnngStateManager } from 'projects/dnng/src/lib/dnng.state.manager';
import { Observable, Subject } from 'rxjs';

interface Person {
  firstName: string;
  lastName: string;
  age: number;
  gender: 'male' | 'female';
  children: { name: string, age: number, gender: 'male' | 'female' }[];
  interest: { name: string, category: string }[];
  personalData: {
    favoliteColor: string,
    hairColor: string,
    smoking: boolean,
    alcohol: boolean,
    orientation: 'homo' | 'hetero',
    favoriteBookTitles: string[]
  };
}

class PersonStateManager extends DnngStateManager<Person> {

  // tslint:disable-next-line: variable-name
  private _onPersonalDataChanged$ = new Subject<void>();
  onPersonalDataChanged$ = this._onPersonalDataChanged$.asObservable();

  changeNameCommand = this.defineCommand(true, (state, parameter?: string) => {
    if (state === null) { return; }
    if (parameter && parameter !== state.firstName) {
      state.firstName = parameter;
      this.notifyStateChanged();
    }
  });

  changeOtherDataCommand =
    this.defineCommand<{ lastName: string, age: number, gender: 'male' | 'female' }>(true, (state, parameter) => {
      let changed = false;
      if (parameter) {
        for (const prop in state) {
          if (prop in parameter && ((state as any)[prop] !== (parameter as any)[prop])) {
            (state as any)[prop] = (parameter as any)[prop];
            changed = true;
          }
        }
      }
      if (changed) {
        this.notifyStateChanged();
      }
    });

  initialNewStateCommand = this.defineCommand(true, (state) => {
    if (state === null) { return; }
    this.reinitialState(state, {
      firstName: 'Jesica',
      lastName: 'Hamilton',
      age: 23,
      gender: 'female',
      children: [
        { name: 'Ricky', age: 13, gender: 'male' }
      ],
      interest: [
        { name: 'lifting', category: 'buty' }
      ],
      personalData: {
        alcohol: false,
        smoking: false,
        favoliteColor: 'pink',
        favoriteBookTitles: [
          'Briged Jones'
        ],
        hairColor: 'Red',
        orientation: 'hetero'
      }
    });
    this.notifyStateChanged();
  });

  changePersonalDataCommand = this.defineCommand(true, (state) => {
    if (state === null) { return; }

    const newAlcoholStatus = false;
    const newSmokingStatus = true;
    const newHairColor = 'black';
    const newOrientation = 'homo';

    let changed = false;

    if (state.personalData.alcohol !== newAlcoholStatus) {
      state.personalData.alcohol = newAlcoholStatus;
      changed = true;
    }
    if (state.personalData.smoking !== newSmokingStatus) {
      state.personalData.smoking = newSmokingStatus;
      changed = true;
    }
    if (state.personalData.hairColor !== newHairColor) {
      state.personalData.hairColor = newHairColor;
      changed = true;
    }
    if (state.personalData.orientation !== newOrientation) {
      state.personalData.orientation = newOrientation;
      changed = true;
    }

    if (changed) {
      this._onPersonalDataChanged$.next();
    }

  });

  protected provideInitialState(): Person | Promise<Person> | Observable<Person> {
    return {
      firstName: 'Henry',
      lastName: 'Smith',
      age: 43,
      gender: 'male',
      children: [
        { name: 'Nick', age: 2, gender: 'male' },
        { name: 'Jesica', age: 4, gender: 'female' },
      ],
      interest: [
        { name: 'foodbol', category: 'sport' },
        { name: 'chemistry', category: 'science' }
      ],
      personalData: {
        favoliteColor: 'black',
        alcohol: true,
        smoking: false,
        hairColor: 'blond',
        orientation: 'hetero',
        favoriteBookTitles: [
          'Painted Man',
          'Hanibal',
          'Kamasutra',
        ]
      }
    };
  }
}

describe('PersonStateManager', () => {
  const personSM = new PersonStateManager();
  personSM.ngOnInit();

  it('personSM.state.firstName should equal "Henry"', () => {
    expect(personSM.state.firstName).toEqual('Henry');
  });
});

describe('PersonStateManager: Invoking change name command', () => {
  let personSM: PersonStateManager;

  beforeEach(() => {
    personSM = new PersonStateManager();
    personSM.ngOnInit();
  });

  beforeEach(() => {
    personSM.changeNameCommand('Jason');
  });

  it('personSM.state.firstName should be equal "Jason"', () => {
    expect(personSM.state.firstName).toEqual('Jason');
  });
});

describe('PersonStateManager: Invoking change other data command', () => {
  let personSM: PersonStateManager;
  let notificationCount = 0;
  beforeAll(() => {
    personSM = new PersonStateManager();
    personSM.ngOnInit();
    personSM.onStateChanged$.subscribe(() => {
      notificationCount++;
    });
  });

  beforeAll(() => {
    personSM.changeOtherDataCommand({ lastName: 'Morison', age: 51, gender: 'female' });
  });

  it('personSM.state.lastName should equal "Morison"', () => {
    expect(personSM.state.lastName).toEqual('Morison');
  });
  it('personSM.state.age should equal 51', () => {
    expect(personSM.state.age).toEqual(51);
  });
  it('personSM.state.gender should equal "female"', () => {
    expect(personSM.state.gender).toEqual('female');
  });
  it('shoul be only one change notofocation', () => {
    expect(notificationCount).toEqual(1);
  });
});

describe('PersonStateManager: Invoking change other data command', () => {
  let personSM: PersonStateManager;
  let notificationCount = 0;
  beforeAll(() => {
    personSM = new PersonStateManager();
    personSM.ngOnInit();
    personSM.onStateChanged$.subscribe(() => {
      notificationCount++;
    });
  });

  beforeAll(() => {
    personSM.changeOtherDataCommand({ lastName: 'Smith', age: 43, gender: 'male' });
  });

  it('personSM.state.lastName should equal "Smith"', () => {
    expect(personSM.state.lastName).toEqual('Smith');
  });
  it('personSM.state.age should equal 43', () => {
    expect(personSM.state.age).toEqual(43);
  });
  it('personSM.state.gender should equal "male"', () => {
    expect(personSM.state.gender).toEqual('male');
  });
  it('shoul be no change notofocation', () => {
    expect(notificationCount).toEqual(0);
  });
});

describe('PersonStateManager: Invoking initial new state command', () => {
  let personSM: PersonStateManager;
  let prevState: any;
  let nextState: any;
  let notificationCount = 0;

  beforeAll(() => {
    personSM = new PersonStateManager();
    personSM.ngOnInit();
    prevState = personSM.state;
    personSM.onStateChanged$.subscribe(() => {
      notificationCount++;
    });
  });

  beforeAll(() => {
    personSM.initialNewStateCommand();
    nextState = personSM.state;
  });

  it('state should have new object', () => {
    expect(prevState !== nextState).toEqual(true);
  });

  it('should have only one notification', () => {
    expect(notificationCount).toEqual(1);
  });

});

describe('PersonStateManaget: Testing custom change notification', () => {
  let personSM: PersonStateManager;
  let notificationCount = 0;
  let customNotificationCount = 0;

  beforeAll(() => {
    personSM = new PersonStateManager();
    personSM.ngOnInit();
    personSM.onStateChanged$.subscribe(() => {
      notificationCount++;
    });
    personSM.onPersonalDataChanged$.subscribe(() => {
      customNotificationCount++;
    });
  });

  beforeAll(() => {
    personSM.changePersonalDataCommand();
  });

  it('personSM.state.personalData.alcohol should equal false', () => {
    expect(personSM.state.personalData.alcohol).toEqual(false);
  });

  it('personSM.state.personalData.smoking should equal true', () => {
    expect(personSM.state.personalData.smoking).toEqual(true);
  });

  it('personSM.state.personalData.hairColor should equal "black"', () => {
    expect(personSM.state.personalData.hairColor).toEqual('black');
  });

  it('personSM.state.personalData.orientation should equal "homo"', () => {
    expect(personSM.state.personalData.orientation).toEqual('homo');
  });
  it('should be no change notification', () => {
    expect(notificationCount).toEqual(0);
  });
  it('should be one change notification from custom change notification system', () => {
    expect(customNotificationCount).toEqual(1);
  });
});

interface CampanyState {
  campanyName: string;
  specialization: string;
  numberOfEmploees: number;
  annualIncom: number;
}

const campanyData: CampanyState = {
  campanyName: 'White Cow',
  specialization: 'Milk Production',
  numberOfEmploees: 300,
  annualIncom: 100000
};

class CampanyStateMenager extends DnngStateManager<CampanyState> {

  public fakeHttp = new Subject<CampanyState>();

  protected provideInitialState(): CampanyState | Promise<CampanyState> | Observable<CampanyState> | null {

    return this.fakeHttp;
  }

}

describe('CampanyStateMenager: emulating data fetch with Observables', () => {
  let campanySM: CampanyStateMenager;

  beforeEach(() => {
    jasmine.clock().uninstall();
    campanySM = new CampanyStateMenager();
    campanySM.ngOnInit();
  });

  it('state should equal null before feched data and after be initialized', () => {
    expect((campanySM as any).__dn_internal_state__).toBeNull();
    campanySM.fakeHttp.next(campanyData);
    expect(campanySM.state).toBeTruthy();
  });
  it('campany.statePending should equel true before feched data and after to be fasle', () => {
    expect(campanySM.statePending).toBeTrue();
    campanySM.fakeHttp.next(campanyData);
    expect(campanySM.statePending).toBeFalse();
  });
  it('campany.stateInitialized should equel false before feched data and after to be true', () => {
    expect(campanySM.stateInitialized).toBeFalse();
    campanySM.fakeHttp.next(campanyData);
    expect(campanySM.stateInitialized).toBeTrue();
  });
});

interface CarState {
  fuel: 'benzin' | 'diesel' | 'gas';
  engineVolume: number;
  mark: string;
  model: string;
}

const carData: CarState = {
  fuel: 'benzin',
  engineVolume: 1.9,
  mark: 'Volgzvagen',
  model: 'Golf 4',
};

class CarStateManager extends DnngStateManager<CarState> {

  promiseResolver: ((valuer: CarState) => void) | null = null;
  fakeHttp = new Promise<CarState>((resolve, reject) => {
    this.promiseResolver = resolve;
  });

  protected provideInitialState(): CarState | Promise<CarState> | Observable<CarState> | null {
    return this.fakeHttp;
  }

}

describe('CarStateManager: emulating data fetch with Promise', () => {

  let carSM: CarStateManager;

  beforeEach(() => {
    carSM = new CarStateManager();
    carSM.ngOnInit();
  });

  it('state should equal null before feched data and after be initialized', (done) => {
    expect((carSM as any).__dn_internal_state__).toBeNull();
    carSM.promiseResolver!(carData);
    setTimeout(() => {
      expect(carSM.state).toBeTruthy();
      done();
    }, 10);
  });
  it('carSM.statePending should equel true before feched data and after to be fasle', (done) => {
    expect(carSM.statePending).toBeTrue();
    carSM.promiseResolver!(carData);
    setTimeout(() => {
      expect(carSM.statePending).toBeFalse();
      done();
    }, 10);
  });
  it('carSM.stateInitialized should equel false before feched data and after to be true', (done) => {
    expect(carSM.stateInitialized).toBeFalse();
    carSM.promiseResolver!(carData);
    setTimeout(() => {
      expect(carSM.stateInitialized).toBeTrue();
      done();
    }, 10);
  });

});
