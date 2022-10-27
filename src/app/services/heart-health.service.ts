import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HeartHealth } from '../models/heart-health';

@Injectable({
  providedIn: 'root'
})
export class HeartHealthService {

  heartHealth_list: HeartHealth[] = [];
  allheartHealthEP = "http://localhost:8000/health_class/"

  constructor(private http: HttpClient) { }

  getAllHeartHealthData():Observable<HeartHealth[]>{
    return this.http.get<HeartHealth[]>(this.allheartHealthEP)
   }

}
