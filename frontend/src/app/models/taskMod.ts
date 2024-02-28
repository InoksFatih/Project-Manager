import { Person } from './personMod';
import { Subtask } from './subtaskMod';
import { Priority } from "./priorityMod";
import { Status } from "./statusMod";
import { Attachement } from "./attachementModel";

export class Task {
  id?: number;
  title!: string;
  detail!: string;
  startDate!: Date | null;
  endDate!: Date | null;
  status!: Status;
  priority!: Priority;
  projectId?: number;
  assignPerson?: Person | null;
  realDaysConsumed?: number | null;
  plannedDays?: number | null;
  subtasks?: Subtask[];
  attachement?: Attachement; // Add the attachement property

  constructor(init?: Partial<Task>) {
    Object.assign(this, init);
  }
}
