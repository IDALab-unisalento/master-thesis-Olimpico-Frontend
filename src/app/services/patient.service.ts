import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  allPatientED = "http://localhost:8000/patient/"
  doctorPatientEP = "http://localhost:8000/doctor_patient/"
  newPatientEP = "http://localhost:8000/patient/"
  updatePatientEP = "http://localhost:8000/patient/"

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
        })
  };

  constructor(private http: HttpClient) { }

  getAllPatient():Observable<Patient[]>{
    return this.http.get<Patient[]>(this.allPatientED)
   }

   getPatientByDoctorId(id: number):Observable<Patient[]>{
    return this.http.post<Patient[]>(this.doctorPatientEP, "{\"id\": "+id.toString()+"}", this.httpOptions)
   }

   newPatient(p: Patient): Observable<any> {
    return this.http.post<any>(this.newPatientEP, p, this.httpOptions)
   }

   updatePatient(p: Patient):Observable<any>{
    return this.http.put<any>(this.updatePatientEP, p, this.httpOptions)
   }

}
