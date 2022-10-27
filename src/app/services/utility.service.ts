import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  patient: Patient = {
    id: 0,
    name: '',
    surname: '',
    sex: 0,
    hypertensive: 0,
    diabetes: 0,
    username: '',
    profile_photo: '',
    birthday: new Date(),
    fiscal_code: '',
    phone_number: 0,
    email: '',
    doctors: [],
    show: false,
    password: ''
  }
  
  constructor() { }
}
