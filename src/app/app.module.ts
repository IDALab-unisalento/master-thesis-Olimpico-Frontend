import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HealthDataComponent } from './components/health-data/health-data.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HealthDataService } from './services/health-data.service';
import { UtilityService } from './services/utility.service';
import {HttpClientModule} from '@angular/common/http'
import { NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { PatientComponent } from './components/patient/patient.component';
import { HeartHealthComponent } from './components/heart-health/heart-health.component';
import { MortalityComponent } from './components/mortality/mortality.component';
import { AnagraphicComponent } from './components/anagraphic/anagraphic.component';
import { DigitalTwinComponent } from './components/digital-twin/digital-twin.component';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    HealthDataComponent,
    NavbarComponent,
    PatientComponent,
    HeartHealthComponent,
    MortalityComponent,
    AnagraphicComponent,
    DigitalTwinComponent,
    UserComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgChartsModule,
    FormsModule
  ],
  providers: [HealthDataService, 
    UtilityService],
  bootstrap: [AppComponent]
})
export class AppModule { }
