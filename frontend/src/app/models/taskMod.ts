import { Person } from './personMod';
import { Subtask } from './subtaskMod';
import {Priority} from "./priorityMod";
import {Status} from "./statusMod";

export class Task {
  id?: number;
  title!: string;
  detail!: string;
  dueDate!: Date | null;
  status!: Status;
  priority!: Priority;
  projectId?: number;
  assignPerson?: Person | null;
  realDaysConsumed!: number;
  plannedDays!: number ;
  subtasks?: Subtask[];
}
