import { Task } from "./taskMod";
import {ProjectClient} from "./projectClientMod";
import {Priority} from "./priorityMod";
import {Status} from "./statusMod";

export class Project {
  id?: number;
  title!: string;
  detail!: string;
  dueDate!: Date | null;
  status!: Status;
  priority!: Priority;
  projectClient?: ProjectClient;
  realDaysConsumed!: string;
  plannedDays!: string;
  tasks?: Task[];
}
