import { HttpClient, HttpHeaders } from '@angular/common/http';
import { identifierName } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EcgEntry } from '../models/ecg-entry';
import { HealthData } from '../models/health-data';

@Injectable({
  providedIn: 'root'
})
export class HealthDataService {

  access_token = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMzhRTUoiLCJzdWIiOiJCNFlWUzIiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJ3aHIgd3BybyB3bnV0IHdzbGUgd3NvYyB3YWN0IHdveHkgd3RlbSB3d2VpIHdzZXQgd3JlcyB3bG9jIiwiZXhwIjoxNjkyODY4NTI1LCJpYXQiOjE2NjEzMzQ0MjZ9.yo6pJRGqVur0r7hpyu7FSsumSNb0TAEGo5LRi5DhzJs"

  health_data_list: HealthData[] = [];
  allHealthDataEP = "http://localhost:8000/health_data/"
  addHealthDataEP  = "http://localhost:8000/health_data/"
  updateHealthDataEP = "http://localhost:8000/health_data/"
  healthDataOfPatientEP = "http://localhost:8000/patient_health_data/"
  ecgEntryEP = "http://localhost:8000/ecg_entry/"
  addECGEP = "http://localhost:8000/ecg_entry/"
  updateECGEP = "http://localhost:8000/ecg_entry/"
  healthClassParamEP = "http://localhost:8000/health_class_param/"

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
        })
  };

  httpOptionFitbit = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization':'Bearer '+this.access_token
    })
  }
  
  constructor(private http: HttpClient) {
   }

   updateHealthData(healthData: HealthData):Observable<HealthData>{
    return this.http.put<HealthData>(this.updateHealthDataEP, healthData, this.httpOptions)
   }

   getBMI():Observable<any>{
    return this.http.get<any>('https://api.fitbit.com/1/user/-/body/log/weight/date/today.json', this.httpOptionFitbit)
   }

   addHealthData(healthData: HealthData):Observable<HealthData>{
    return this.http.post<HealthData>(this.addHealthDataEP, healthData, this.httpOptions)
   }

   updateECG(ecg: EcgEntry):Observable<EcgEntry>{
    return this.http.put<EcgEntry>(this.updateECGEP, ecg, this.httpOptions)
   }

   addEcgData(ecg_entry: any):Observable<any>{
    return this.http.post<EcgEntry>(this.addECGEP, ecg_entry, this.httpOptions)
   }

   getEcgEntry(health_data_id: number):Observable<EcgEntry>{
    return this.http.get<EcgEntry>(this.ecgEntryEP + health_data_id)
   }

   getAllHealthData():Observable<HealthData[]>{
    return this.http.get<HealthData[]>(this.allHealthDataEP)
   }

   getAllHeathDataOfPatient(id: string):Observable<HealthData[]>{
    return this.http.post<HealthData[]>(this.healthDataOfPatientEP, "{\"id\": "+id+"}", this.httpOptions)
   }

   getHeartRate():Observable<any>{
    return this.http.get<any>('https://api.fitbit.com/1/user/-/activities/heart/date/today/1d.json', this.httpOptionFitbit)
   }

   getSteps():Observable<any>{
    let d = new Date()
    let m = d.getMonth()+1
    let n = d.getDate()
    let date=''
    if(m<10 && n<10){
      date = d.getFullYear() + "-0" + m + "-0" + d.getDate()
    } else if(m>10 && n<10){
      date = d.getFullYear() + "-" + m + "-0" + d.getDate()
    }else if(m<10 && n>10){
      date = d.getFullYear() + "-0" + m + "-" + d.getDate()
    } else{
      date = d.getFullYear() + "-" + m + "-" + d.getDate()
    }
    console.log(date)
    return this.http.get<any>('https://api.fitbit.com/1/user/-/activities/steps/date/'+date+'/30d.json', this.httpOptionFitbit)
   }

   getDayliSummary():Observable<any>{
    let d = new Date()
    let m = d.getMonth()+1
    let n = d.getDate()
    let date=''
    if(m<10 && n<10){
      date = d.getFullYear() + "-0" + m + "-0" + d.getDate()
    } else if(m>10 && n<10){
      date = d.getFullYear() + "-" + m + "-0" + d.getDate()
    }else if(m<10 && n>10){
      date = d.getFullYear() + "-0" + m + "-" + d.getDate()
    } else{
      date = d.getFullYear() + "-" + m + "-" + d.getDate()
    }
    return this.http.get<any>('https://api.fitbit.com/1/user/-/activities/date/'+date+'.json', this.httpOptionFitbit)
   }

   getFitbitProfile():Observable<any>{
    return this.http.get<any>('https://api.fitbit.com/1/user/-/profile.json', this.httpOptionFitbit)
   }

   getCalories():Observable<any>{
    let d = new Date()
    let m = d.getMonth()+1
    let date=''
    if(m<10){
      date = d.getFullYear() + "-0" + m + "-" + d.getDate()
    } else {
      date = d.getFullYear() + "-" + m + "-" + d.getDate()
    }
    return this.http.get<any>('https://api.fitbit.com/1/user/-/activities/calories/date/'+date+'/1d.json', this.httpOptionFitbit)
   }

   getDistance():Observable<any>{
    let d = new Date()
    let m = d.getMonth()+1
    let date=''
    if(m<10){
      date = d.getFullYear() + "-0" + m + "-" + d.getDate()
    } else {
      date = d.getFullYear() + "-" + m + "-" + d.getDate()
    }
    return this.http.get<any>('https://api.fitbit.com/1/user/-/activities/distance/date/'+date+'/1d.json', this.httpOptionFitbit)
   }

   getFloor():Observable<any>{
    let d = new Date()
    let m = d.getMonth()+1
    let date=''
    if(m<10){
      date = d.getFullYear() + "-0" + m + "-" + d.getDate()
    } else {
      date = d.getFullYear() + "-" + m + "-" + d.getDate()
    }
    return this.http.get<any>('https://api.fitbit.com/1/user/-/activities/floors/date/'+date+'/1d.json', this.httpOptionFitbit)
   }

   getBreathingRate():Observable<any>{
    return this.http.get<any>('https://api.fitbit.com/1/user/-/br/date/today.json', this.httpOptionFitbit)
   }

   getSpO2():Observable<any>{
    return this.http.get<any>('https://api.fitbit.com/1/user/-/spo2/date/today.json', this.httpOptionFitbit)
   }

   getTemperature():Observable<any>{
    return this.http.get<any>('https://api.fitbit.com/1/user/-/temp/core/date/today.json', this.httpOptionFitbit)
   }

   getHRV():Observable<any>{
    return this.http.get<any>('https://api.fitbit.com/1/user/-/hrv/date/today.json', this.httpOptionFitbit)
   }

   getFitbitToken():Observable<any>{
    return this.http.get<any>('https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=238QMJ&redirect_uri=http%3A%2F%2Flocalhost&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight%20oxygen_saturation%20respiratory_rate%20temperature&expires_in=2419200')
   }

   getProfile(){
    fetch('https://api.fitbit.com/1/user/-/activities/heart/date/today/1d.json', {
      method: "GET",
      headers:{"Authorization":"Bearer "+this.access_token}
    })
    .then(response => response.json())
    .then(json => console.log(json))
   }

   getHealthClassificationParam():Observable<any>{
    return this.http.get<any>(this.healthClassParamEP)
   }

}
