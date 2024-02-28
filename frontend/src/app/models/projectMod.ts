import { Task } from "./taskMod";
import {ProjectClient} from "./projectClientMod";
import {Priority} from "./priorityMod";
import {Status} from "./statusMod";

export class Project {
  id?: number;
  title!: string;
  detail!: string;
  status!: Status;
  priority!: Priority;
  projectClient?: ProjectClient;
  realDaysConsumed?: number | null;
  plannedDays?: number | null;
  tasks?: Task[];
}
