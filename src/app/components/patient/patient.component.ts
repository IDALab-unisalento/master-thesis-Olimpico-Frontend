import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HealthData } from 'src/app/models/health-data';
import { Patient } from 'src/app/models/patient';
import { HealthDataService } from 'src/app/services/health-data.service';
import { MortalityService } from 'src/app/services/mortality.service';
import { PatientService } from 'src/app/services/patient.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {

  allPatients: Patient[] = []
  allHealthPatientData: HealthData[] = []
  newPatient: Patient = {
    id: 0,
    name: '',
    surname: '',
    sex: 0,
    hypertensive: 0,
    diabetes: 0,
    username: '',
    password:'',
    profile_photo: '',
    birthday: new Date(),
    fiscal_code: '',
    phone_number: 0,
    email: '',
    doctors: [],
    show: false
  }
  new = false
  regSucc = false
  userAlredyExist = false

  constructor(private patientService: PatientService, private utilityService: UtilityService, private readonly router: Router) { }

  unset(){
    sessionStorage.setItem("id","")
    sessionStorage.setItem("jwt","")
    sessionStorage.setItem("type","")
  }

  ngOnInit(): void {
    if(sessionStorage.getItem("type")=="doctor"){
    this.patientService.getAllPatient().subscribe(data => {
      this.allPatients=data
      for(let i=0; i<this.allPatients.length; i++){
        this.allPatients[i].show = false
      }
    });
  }
  }

  showHideDetail(p: Patient){
    p.show = !p.show
  }

  setPatient(p: Patient){
    this.utilityService.patient = p;
    this.router.navigate(['\digitalTwin']);
    
  }

  registrate(){
    this.newPatient.doctors.push(parseInt(sessionStorage.getItem("id") || '0'))
    this.patientService.newPatient(this.newPatient).subscribe(data => {
      console.log(data)
      if(data.toString=='Added Successfully'){
        this.regSucc = true
        location.reload()
      } else if(data.toString=='Failed to add'){
        this.userAlredyExist=true
      }
    })
  }

}
