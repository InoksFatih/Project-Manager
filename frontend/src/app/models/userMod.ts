import {Person} from "./personMod";

export class User {
  id!: number;
  login!: string;
  password!: string;
  isAdmin!: boolean;
  person!: Person;
}
