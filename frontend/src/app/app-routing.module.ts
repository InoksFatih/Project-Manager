import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {ProjectsComponent} from "./components/projects/projects.component";
import {TasksComponent} from "./components/tasks/tasks.component";
import {CalendarComponent} from "./components/calendar/calendar.component";
import {MytasksComponent} from "./components/mytasks/mytasks.component";
import {SubtasksComponent} from "./components/subtasks/subtasks.component";

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'projects', component: ProjectsComponent},
  {path: 'tasks/:projectId', component: TasksComponent},
  {path: 'subtasks/:taskId', component: SubtasksComponent},
  {path: 'calendar', component: CalendarComponent},
  {path: 'mytasks', component: MytasksComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
