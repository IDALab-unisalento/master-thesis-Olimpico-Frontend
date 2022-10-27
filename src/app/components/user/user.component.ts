import { Component, OnInit } from '@angular/core';
import { Doctor } from 'src/app/models/doctor';
import { Hospital } from 'src/app/models/hospital';
import { Patient } from 'src/app/models/patient';
import { HospitalService } from 'src/app/services/hospital.service';
import { PatientService } from 'src/app/services/patient.service';
import { UserService } from 'src/app/services/user.service';
import { UtilityService } from 'src/app/services/utility.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  doctorId = 0

  doctorUser: Doctor = {
    id: 0,
    name: '',
    surname: '',
    username: '',
    profile_photo: '',
    birthday: '',
    specialization: '',
    phone_number: '',
    email: '',
    hospital: 0,
    patients: []
  }
  hospital: Hospital = {
    id: 0,
    name: '',
    country: '',
    city: '',
    province: '',
    address: '',
    postal_code: '',
    phone_number: '',
    email: ''
  }

  patientList: Patient[] = []

  constructor(private userService: UserService, private hospitalService: HospitalService, private patientService: PatientService, private utilityService: UtilityService, private readonly router: Router) { }

  unset(){
    sessionStorage.setItem("id","")
    sessionStorage.setItem("jwt","")
    sessionStorage.setItem("type","")
  }

  ngOnInit(): void {
    if(sessionStorage.getItem("type")=="doctor"){
    this.doctorId = parseInt(sessionStorage.getItem("id") || '0')
    this.userService.getDoctorById(this.doctorId).subscribe(data => {
      this.doctorUser = data
      this.patientService.getPatientByDoctorId(this.doctorId).subscribe(data => {
        this.patientList = data
        console.log(this.patientList)
      });
      this.hospitalService.getHospitalById(this.doctorUser.hospital).subscribe(data => {
        this.hospital = data
      });
    });
  }
  }

  setPatient(p: Patient){
    this.utilityService.patient = p;
    this.router.navigate(['\digitalTwin']);
    
  }

}
