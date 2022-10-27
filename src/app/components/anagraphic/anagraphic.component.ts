import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { HealthData } from 'src/app/models/health-data';
import { Patient } from 'src/app/models/patient';
import { HealthDataService } from 'src/app/services/health-data.service';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-anagraphic',
  templateUrl: './anagraphic.component.html',
  styleUrls: ['./anagraphic.component.scss']
})
export class AnagraphicComponent implements OnInit {

  healthDataList: HealthData[] = []
  healthyDataList: HealthData[] = []
  notHealthyDataList: HealthData[] = []
  manList: HealthData[] = []
  womanList: HealthData[] = []
  parameterListHealthy: number[] = []
  ageListHealthy: number[] = []
  parameterListNotHealthy: number[] = []
  ageListNotHealthy: number[] = []

  patientList: Patient[] = []

  bcMetric = 'Heartbeat'
  manCounter: number[] = []
  womanCounter: number[] = []

  public lineChartData: ChartConfiguration<'line'>['data'] = { datasets: [] };
  public lineChartOptions: ChartOptions<'line'> = { responsive: false };

  public barChartLegend = false;
  public barChartPlugins = [];
  public healthBarCharData: ChartConfiguration<'bar'>['data'] = { datasets: [] };
  public healthBarChartOption: ChartConfiguration<'bar'>['options'] = {};
  public lineChartLegend = true;

  param = 'Heartbeat'

  constructor(private healthService: HealthDataService, private patientService: PatientService) { }

  ngOnInit(): void {
    if (sessionStorage.getItem("type") == 'doctor') {
      this.healthService.getAllHealthData().subscribe(data => {
        this.healthDataList = data

        this.patientService.getAllPatient().subscribe(data => {
          this.patientList = data

          //Separation healthy and not healthy
          for (let i = 0; i < this.healthDataList.length; i++) {
            if (this.healthDataList[i].health_classification < 0.5) {
              this.healthyDataList.push(this.healthDataList[i])
            }
            else {
              this.notHealthyDataList.push(this.healthDataList[i])
            }
          }
          

          this.defineCounter(this.healthyDataList, this.param, this.parameterListHealthy, this.ageListHealthy)
          this.defineCounter(this.notHealthyDataList, this.param, this.parameterListNotHealthy, this.ageListNotHealthy)
          this.setLineChart()

          //separare pazienti in maschi e donne
          this.splitDatasetForSex(this.healthDataList, this.manList, this.womanList)
          this.defineCounterBC(this.manList, this.manCounter, this.bcMetric)
          this.defineCounterBC(this.womanList, this.womanCounter, this.bcMetric)
          this.setBarChart(["Man Healthy", "Man Not Healthy", "Woman healthy", "Woman Not Healthy"], this.manCounter, this.womanCounter)

        })
      })
    }
  }

  splitDatasetForSex(healthList: HealthData[], man: HealthData[], woman: HealthData[]) {
    for (let i = 0; i < healthList.length; i++) {
      if (this.getPatientSex(healthList[i].patient) == 0) {
        woman.push(healthList[i])
      } else {
        man.push(healthList[i])
      }
    }
  }

  setParam(metric: string) {
    this.param = metric
    this.parameterListHealthy = []
    this.parameterListNotHealthy = []
    this.ageListHealthy = []
    this.ageListNotHealthy = []
    this.defineCounter(this.healthyDataList, metric, this.parameterListHealthy, this.ageListHealthy)
    this.defineCounter(this.notHealthyDataList, metric, this.parameterListNotHealthy, this.ageListNotHealthy)
    this.setLineChart()
  }

  setBCParam(metric: string) {
    this.bcMetric = metric
    this.defineCounterBC(this.manList, this.manCounter, this.bcMetric)
    this.defineCounterBC(this.womanList, this.womanCounter, this.bcMetric)
    this.setBarChart(["Man Healthy", "Man Not Healthy", "Woman healthy", "Woman Not Healthy"], this.manCounter, this.womanCounter)

  }

  defineCounter(list: HealthData[], par: string, outParam: number[], outAge: number[]) {
    for (let i = 0; i < 120; i++) {
      let a = this.computerAverageOfMetric(par, list, i + 1)
      if (a != 0) {
        outAge.push(i + 1)
        outParam.push(this.computerAverageOfMetric(par, list, i + 1))
      }
    }
  }

  defineCounterBC(list: HealthData[], counter: number[], metric: string) {
    let healthyCounter = 0
    let notHealthyCounter = 0
    if (metric == 'Glucose') {
      for (let i = 0; i < list.length; i++) {
        if (this.healthDataList[i].blood_glucose > 120 || this.healthDataList[i].blood_glucose < 70) {
          notHealthyCounter += 1
        }
        else {
          healthyCounter += 1
        }
      }
    } else if (metric == 'Heartbeat') {
      for (let i = 0; i < list.length; i++) {
        if (this.healthDataList[i].heartbeat > 100 || this.healthDataList[i].heartbeat < 60) {
          notHealthyCounter += 1
        }
        else {
          healthyCounter += 1
        }
      }
    } else if (metric == 'SpO2') {
      for (let i = 0; i < list.length; i++) {
        if (this.healthDataList[i].oxygen_saturation < 92) {
          notHealthyCounter += 1
        }
        else {
          healthyCounter += 1
        }
      }
    }
    else if (metric == 'Systole') {
      for (let i = 0; i < list.length; i++) {
        if (this.healthDataList[i].systole < 90 || this.healthDataList[i].systole > 120) {
          notHealthyCounter += 1
        }
        else {
          healthyCounter += 1
        }
      }
    } else if (metric == 'Diastole') {
      for (let i = 0; i < list.length; i++) {
        if (this.healthDataList[i].diastole < 60 || this.healthDataList[i].diastole > 80) {
          notHealthyCounter += 1
        }
        else {
          healthyCounter += 1
        }
      }
    } else if (metric == 'Temperature') {
      for (let i = 0; i < list.length; i++) {
        if (this.healthDataList[i].temperature < 35.2 || this.healthDataList[i].temperature > 36.9) {
          notHealthyCounter += 1
        }
        else {
          healthyCounter += 1
        }
      }
    } else if (metric == 'Breathing Rate') {
      for (let i = 0; i < list.length; i++) {
        if (this.healthDataList[i].temperature < 16 || this.healthDataList[i].temperature > 20) {
          notHealthyCounter += 1
        }
        else {
          healthyCounter += 1
        }
      }
    }
    counter[0] = healthyCounter
    counter[1] = notHealthyCounter
  }

  getPatientAge(patientId: number): number {
    let age: number = 0
    let today = new Date()
    for (let i = 0; i < this.patientList.length; i++) {
      if (this.patientList[i].id == patientId) {
        let birthday = new Date(this.patientList[i].birthday).getFullYear()
        age = today.getFullYear() - birthday
        break
      }
    }
    return Math.floor(age)
  }

  getPatientSex(patientId: number): number {
    let sex: number = 2
    let today = new Date()
    for (let i = 0; i < this.patientList.length; i++) {
      if (this.patientList[i].id == patientId) {
        sex = this.patientList[i].sex
        break
      }
    }
    return sex
  }

  computerAverageOfMetric(metric: string, list: HealthData[], xValue: number): number {
    let average = 0
    let count = 0
    if (metric == 'Heartbeat') {
      for (let i = 0; i < list.length; i++) {
        if (this.getPatientAge(list[i].patient) == xValue) {
          average += list[i].heartbeat
          count += 1
        }
      }
    } else if (metric == 'Glucose') {
      for (let i = 0; i < list.length; i++) {
        if (this.getPatientAge(list[i].patient) == xValue) {
          average += list[i].blood_glucose
          count += 1
        }
      }
    } else if (metric == 'Bicarbonate') {
      for (let i = 0; i < list.length; i++) {
        if (this.getPatientAge(list[i].patient) == xValue) {
          average += list[i].bicarbonate
          count += 1
        }
      }
    } else if (metric == 'BMI') {
      for (let i = 0; i < list.length; i++) {
        if (this.getPatientAge(list[i].patient) == xValue) {
          average += list[i].bmi
          count += 1
        }
      }
    } else if (metric == 'Anion Gap') {
      for (let i = 0; i < list.length; i++) {
        if (this.getPatientAge(list[i].patient) == xValue) {
          average += list[i].anion_gap
          count += 1
        }
      }
    } else if (metric == 'Breathing Rate') {
      for (let i = 0; i < list.length; i++) {
        if (this.getPatientAge(list[i].patient) == xValue) {
          average += list[i].breathing_rate
          count += 1
        }
      }
    } else if (metric == 'Lactic Acid') {
      for (let i = 0; i < list.length; i++) {
        if (this.getPatientAge(list[i].patient) == xValue) {
          average += list[i].lactic_acid
          count += 1
        }
      }
    } else if (metric == 'SpO2') {
      for (let i = 0; i < list.length; i++) {
        if (this.getPatientAge(list[i].patient) == xValue) {
          average += list[i].oxygen_saturation
          count += 1
        }
      }
    } else if (metric == 'Urea Nitrogen') {
      for (let i = 0; i < list.length; i++) {
        if (this.getPatientAge(list[i].patient) == xValue) {
          average += list[i].urea_nitrogen
          count += 1
        }
      }
    } else if (metric == 'Serum Cholestoral') {
      for (let i = 0; i < list.length; i++) {
        if (this.getPatientAge(list[i].patient) == xValue) {
          average += list[i].serum_cholestoral
          count += 1
        }
      }
    } else if (metric == 'Systole') {
      for (let i = 0; i < list.length; i++) {
        if (this.getPatientAge(list[i].patient) == xValue) {
          average += list[i].systole
          count += 1
        }
      }
    } else if (metric == 'Diastole') {
      for (let i = 0; i < list.length; i++) {
        if (this.getPatientAge(list[i].patient) == xValue) {
          average += list[i].diastole
          count += 1
        }
      }
    }

    if (average != 0 && count != 0) {
      average = average / count
    }
    return average
  }

  setLineChart() {
    //unire ageListHealthy e ageListNotHealthy
    let ageList:number [] = this.ageListHealthy.concat(this.ageListNotHealthy)
    ageList.sort(function(a, b) {
      return a - b;
    });
    let aList:number[] = []
    for(let i=0; i<ageList[ageList.length-1]; i++){
      aList.push(i+1)
    }
    //modificare parameterListHealthy e parameterListNotHealthy
    let healthy:number[] = []
    let notHealthy:number[] = []
    for(let i=0; i<aList.length; i++){
      let c = false
      let j=0
      for(j=0; j<this.ageListHealthy.length; j++){
        if(this.ageListHealthy[j]==i+1){
          c=true
          break
        }
      }
      if(c){
        healthy[i]=this.parameterListHealthy[j]
      } else {
        healthy[i]=0
      }
    }
    for(let i=0; i<aList.length; i++){
      let c = false
      let j=0
      for(j=0; j<this.ageListNotHealthy.length; j++){
        if(this.ageListNotHealthy[j]==i+1){
          c=true
          break
        }
      }
      if(c){
        notHealthy[i]=this.parameterListNotHealthy[j]
      } else {
        notHealthy[i]=0
      }
    }

    this.lineChartData = {
      labels: aList,
      datasets: [
        {
          data: healthy,
          label: 'Healthy',
          fill: true,
          tension: 0.5,
          borderColor: 'black',
          backgroundColor: 'rgba(255,0,0,0.3)'
        },
        {
          data: notHealthy,
          label: 'Not Healthy',
          fill: true,
          tension: 0.5,
          borderColor: 'black',
          backgroundColor: 'rgba(0,125,255,0.3)'
        }
      ]
    };
  }

  unset() {
    sessionStorage.setItem("id", "")
    sessionStorage.setItem("jwt", "")
    sessionStorage.setItem("type", "")
  }

  setBarChart(metricList: string[], metricCounter1: number[], metricCounter2: number[]): void {
    //Barchart
    this.healthBarCharData = {
      labels: metricList,
      datasets: [
        {
          data: metricCounter1,
          backgroundColor: 'rgb(54, 162, 235)'
        },
        {
          data: metricCounter2,
          backgroundColor: 'rgb(255, 99, 132)'
        }
      ]
    };

    this.healthBarChartOption = {
      responsive: true,
    };
  }

}
