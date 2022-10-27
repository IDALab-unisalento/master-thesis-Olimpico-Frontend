import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Hospital } from '../models/hospital';


@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  allHospitalEP = "http://localhost:8000/hospital/"

  constructor(private http: HttpClient) { }

  getAllHospital():Observable<Hospital[]>{
    return this.http.get<Hospital[]>(this.allHospitalEP)
   }

   getHospitalById(id: number):Observable<Hospital>{
    return this.http.get<Hospital>(this.allHospitalEP + id.toString())
   }
}
