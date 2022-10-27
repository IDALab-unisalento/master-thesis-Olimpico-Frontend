import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';import { MortalityData } from '../models/mortality-data';

@Injectable({
  providedIn: 'root'
})
export class MortalityService {

  mortality_list: MortalityData[] = [];
  allMortalityEntryEP = "http://localhost:8000/dead_class/"
  mortalityClassParamEP = "http://localhost:8000/mort_class_param/"

  constructor(private http: HttpClient) { }

  getAllMortalityData():Observable<MortalityData[]>{
    return this.http.get<MortalityData[]>(this.allMortalityEntryEP)
   }

   getMortalityClassParam():Observable<any>{
    return this.http.get<any>(this.mortalityClassParamEP)
   }

}
