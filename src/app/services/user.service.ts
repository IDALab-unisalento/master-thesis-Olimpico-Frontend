import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Doctor } from '../models/doctor';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
        })
  };

  allDoctorsEP = "http://localhost:8000/doctor/"
  loginEP = "http://localhost:8000/login/"
  registrationEP = "http://localhost:8000/doctor/"

  constructor(private http: HttpClient) { }

  getAllDoctor():Observable<Doctor[]>{
    return this.http.get<Doctor[]>(this.allDoctorsEP)
   }

   getDoctorById(id: number):Observable<Doctor>{
    return this.http.get<Doctor>(this.allDoctorsEP + id.toString())
   }

   login(credential: any):Observable<any>{
    return this.http.post<any>(this.loginEP, credential, this.httpOptions)
   }

   newDoctor(user: Doctor):Observable<any>{
    return this.http.post<any>(this.registrationEP, user, this.httpOptions)
   }
}
