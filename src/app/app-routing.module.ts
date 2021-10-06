import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlanningComponent} from './planning/planning.component';

const routes: Routes = [
  { path: "", redirectTo: "/planning", pathMatch: "full" },
  { path: "planning", component: PlanningComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
