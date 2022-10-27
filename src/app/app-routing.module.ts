import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnagraphicComponent } from './components/anagraphic/anagraphic.component';
import { DigitalTwinComponent } from './components/digital-twin/digital-twin.component';
import { HealthDataComponent } from './components/health-data/health-data.component';
import { HeartHealthComponent } from './components/heart-health/heart-health.component';
import { LoginComponent } from './components/login/login.component';
import { MortalityComponent } from './components/mortality/mortality.component';
import { PatientComponent } from './components/patient/patient.component';
import { UserComponent } from './components/user/user.component';

const routes: Routes = [
  {path:'', component:LoginComponent},
  {path: '\home', component: HealthDataComponent},
  {path:'\heartHealth', component:HeartHealthComponent},
  {path:'\deadProbability', component:MortalityComponent},
  {path:'\anagraphicAnalysis', component:AnagraphicComponent},
  {path:'\patients', component:PatientComponent},
  {path:'\digitalTwin', component:DigitalTwinComponent},
  {path:'\profile',component:UserComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
