import {Subtask} from "./subtaskMod";
import {Task} from "./taskMod";

export class Person {
  id!: number;
  firstName!: string;
  lastName!: string;
  email!: string;
  phoneNumber!: number;
  isActive!: boolean;
  tasks!: Task[];
  subtasks!: Subtask[];

}
