import {Person} from "./personMod";
import {Priority} from "./priorityMod";
import {Status} from "./statusMod";

export class Subtask {
  id?: number;
  title!: string;
  detail!: string;
  dueDate!: Date | null;
  status!: Status;
  priority!: Priority;
  taskId?: number;
  assignPerson?: Person | null;
  realDaysConsumed!: number;
  plannedDays!: number ;
}
