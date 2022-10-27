import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Doctor } from 'src/app/models/doctor';
import { Hospital } from 'src/app/models/hospital';
import { Patient } from 'src/app/models/patient';
import { HospitalService } from 'src/app/services/hospital.service';
import { PatientService } from 'src/app/services/patient.service';
import { UserService } from 'src/app/services/user.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginData = {
    "username":"",
    "password":""
  }

  idAndJwt = {
    "id":"",
    "jwt":"",
    "type":""
  }
  doctorBoolean = true
  wrongCredential = false
  userNotFound = false
  regSucc = false

  newDoctor: Doctor = {
    id: 0,
    name: '',
    surname: '',
    username: '',
    password:'',
    profile_photo: '',
    birthday: '',
    specialization: '',
    phone_number: '',
    email: '',
    hospital: 0,
    patients: []
  }

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

  patientList: Patient[] = []
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

  constructor(private hospitalService: HospitalService,  private patientService: PatientService, private userService: UserService, private utilityService: UtilityService, private readonly router: Router) { }

  ngOnInit(): void {
  }

  login(){
    this.userService.login(this.loginData).subscribe(data => {
      this.idAndJwt = data
      if(this.idAndJwt.type!='doctor'){
        this.doctorBoolean = false
      } else if(this.idAndJwt.toString() == 'Wrong credentials') {
        this.wrongCredential = true
      } else if(this.idAndJwt.toString() == 'User not found') {
        this.userNotFound = true
      } else {
        sessionStorage.setItem("id",this.idAndJwt.id)
        sessionStorage.setItem("jwt",this.idAndJwt.jwt)
        sessionStorage.setItem("type",this.idAndJwt.type)
        this.router.navigate(['\home']);
      }
    })
  }

  registrate(){
    this.userService.newDoctor(this.newDoctor).subscribe(data => {
      if(data.toString=='Added Successfully'){
        this.regSucc = true
      }
    })
  }

}
