import { DnngStateManager } from 'projects/dnng/src/public-api';


interface Person {
  firstName: string;
  lastName: string;
  age: number;
  gender: 'male' | 'female';
  hobees: { category: string, name: string }[];
  children: { name: string, age: number, gender: 'male' | 'female' }[];
}

export class PersonStateMenager extends DnngStateManager<Person> {
  onStateMenagerInit(): void {
    throw new Error('Method not implemented.');
  }
  provideInitialState(): Person {
    return {
      firstName: 'Alex',
      lastName: 'Smith',
      age: 42,
      gender: 'male',
      hobees: [
        { name: 'footboll', category: 'sport' },
        { name: 'chemistry', category: 'science' }
      ],
      children: [
        { name: 'Ricky', age: 3, gender: 'male' },
        { name: 'Nina', age: 5, gender: 'female' }
      ]
    };
  }

}
