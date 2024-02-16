import {Subtask} from "./subtaskMod";
import {Task} from "./taskMod";
import {User} from "./userMod";
export class Person {
  id!: number;
  firstName!: string;
  lastName!: string;
  email!: string;
  phoneNumber!: number;
  isActive!: boolean;
  user!: User;
  tasks!: Task[];
  subtasks!: Subtask[];

}
