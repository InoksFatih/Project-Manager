import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {ProjectsComponent} from "./projects/projects.component";
import {TasksComponent} from "./tasks/tasks.component";
import {CalendarComponent} from "./calendar/calendar.component";
import {MytasksComponent} from "./mytasks/mytasks.component";
import {NotificationsComponent} from "./notifications/notifications.component";
import {ProfileComponent} from "./profile/profile.component";
import {SubtasksComponent} from "./subtasks/subtasks.component";

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'projects', component: ProjectsComponent},
  {path: 'tasks/:projectId', component: TasksComponent},
  {path: 'subtasks/:taskId', component: SubtasksComponent},
  {path: 'calendar', component: CalendarComponent},
  {path: 'mytasks', component: MytasksComponent},
  {path: 'notifications', component: NotificationsComponent},
  {path: 'profile', component: ProfileComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
