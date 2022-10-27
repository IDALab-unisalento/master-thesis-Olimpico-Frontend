import { formatCurrency } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { HealthData } from 'src/app/models/health-data';
import { HeartHealth } from 'src/app/models/heart-health';
import { Patient } from 'src/app/models/patient';
import { HealthDataService } from 'src/app/services/health-data.service';
import { HeartHealthService } from 'src/app/services/heart-health.service';
import { PatientService } from 'src/app/services/patient.service';
import { __values } from 'tslib';

@Component({
  selector: 'app-heart-health',
  templateUrl: './heart-health.component.html',
  styleUrls: ['./heart-health.component.scss']
})
export class HeartHealthComponent implements OnInit {

  heartHealth_list: HeartHealth[] = []
  hearthHealth_list_fromBE: HeartHealth[] = []
  healthy_list: HeartHealth[] = []
  notHealthyList: HeartHealth[] = []
  selectedMetricHealthyList: number[] = []
  selectedMetricNotHealthyList: number[] = []
  dates: number[] = []

  health_data_list: HealthData[] = []
  healthy_data_list: HealthData[] = []
  notHealthy_data_list: HealthData[] = []
  health_data_list_from_be: HealthData[] = [];

  patient_list: Patient[] = []

  averageArray: number[] = []
  maxArray: number[] = []

  metricCounter1: number[] = []
  metricList1: string[] = []
  metricCounter2: number[] = []
  metricList2: string[] = []

  selectedMetric = ''
  selectedMetricBC1 = ''
  selectedMetricBC2 = ''

  public radarChartOptions: ChartConfiguration<'radar'>['options'] = {}
  public radarChartLabels: string[] = []
  public radarChartDatasets: ChartConfiguration<'radar'>['data']['datasets'] = [];


  public lineChartData: ChartConfiguration<'line'>['data'] = { datasets: [] };
  public lineChartOptions: ChartOptions<'line'> = { responsive: false };
  public lineChartLegend = true;

  public barChartLegend = false;
  public barChartPlugins = [];
  public healthBarCharData: ChartConfiguration<'bar'>['data'] = { datasets: [] };
  public healthBarChartOption: ChartConfiguration<'bar'>['options'] = {};
  public healthBarCharData1: ChartConfiguration<'bar'>['data'] = { datasets: [] };
  public healthBarChartOption1: ChartConfiguration<'bar'>['options'] = {};

  healthy_values: number[] = [0, 0, 0, 0, 0]
  notHealthy_values: number[] = [0, 0, 0, 0, 0]

  healthCounter: number[] = []
  mortalityCounter: number[] = []
  ecgCounter: number[] = []
  hospitalizationCounter: number[] = []

  public startDate: Date = new Date;
  public endDate: Date = new Date;

  constructor(private heartHealthService: HeartHealthService, private patient_service: PatientService, private health_data_service: HealthDataService) { }

  ngOnInit(): void {
    if(sessionStorage.getItem("type")=="doctor"){
    this.selectedMetric = 'Heartbeat' //for lin chart
    this.selectedMetricBC1 = 'Age'    //for bar chart 1
    this.selectedMetricBC2 = 'Age'    //for bar chart 2
    this.heartHealthService.getAllHeartHealthData().subscribe(data => {
      this.heartHealth_list = data
      this.hearthHealth_list_fromBE = data
      //Separation
      for (let i = 0; i < this.heartHealth_list.length; i++) {
        if (this.heartHealth_list[i].health_data > 0) {
          if (this.heartHealth_list[i].health_classification < 0.5) {
            this.healthy_list.push(this.heartHealth_list[i])
          }
          else {
            this.notHealthyList.push(this.heartHealth_list[i])
          }
        }
      }


      this.computeAverage(this.healthy_list, this.healthy_values)
      this.computeAverage(this.notHealthyList, this.notHealthy_values)
      this.setRadarChart()

      this.defineCounter(this.notHealthyList, this.metricList1, this.metricCounter1, 'Age')
      this.defineCounter(this.notHealthyList, this.metricList2, this.metricCounter2, 'Age')
      this.setBarChart(this.metricList1, this.metricCounter1, this.metricList2, this.metricCounter2)

    });
    this.health_data_service.getAllHealthData().subscribe(data => {
      this.health_data_list = data
      this.health_data_list_from_be = data
      for (let i = 0; i < this.health_data_list.length; i++) {
        this.health_data_list[i].datetime = new Date(this.health_data_list[i].datetime)
      }
      this.selectMetrics(this.selectedMetric)
    });
  }
  }

  computeAverage(list: HeartHealth[], values: number[]) {
    for (let i = 0; i < list.length; i++) {
      values[0] += list[i].age
      values[1] += list[i].sex
      values[2] += list[i].blood_pressure
      values[3] += list[i].serum_cholestoral
      values[4] += list[i].heartbeat
    }
    for (let i = 0; i < values.length; i++) {
      values[i] = values[i] / (list.length)
    }
  }

  findHealthDataFromHeartHealt(heartHealth: HeartHealth): HealthData {
    for (let j = 0; j < this.health_data_list.length; j++) {
      if (this.health_data_list[j].id == heartHealth.health_data) {
        return this.health_data_list[j]
      }
    }
    let h: HealthData = {
      id: 0,
      datetime: new Date(-90000000000000),
      heartbeat: 0,
      systole: 0,
      diastole: 0,
      oxygen_saturation: 0,
      breathing_rate: 0,
      blood_glucose: 0,
      temperature: 0,
      chest_pain_type: 0,
      serum_cholestoral: 0,
      exercise_induced_angina: 0,
      ST_depress_induced_by_exercise_relative_to_rest: 0,
      health_classification: 0,
      bmi: 0,
      atrial_fibrillation: 0,
      leucocyte: 0,
      urea_nitrogen: 0,
      anion_gap: 0,
      bicarbonate: 0,
      lactic_acid: 0,
      mortality_risk: 0,
      ECG_classification: 0,
      hospitalization_risk: 0,
      patient: 0
    }
    return h
  }

  filterData() {
    this.health_data_list = Object.values(this.health_data_list_from_be);
    this.heartHealth_list = Object.values(this.hearthHealth_list_fromBE);

    let s = new Date(this.startDate)
    let e = new Date(this.endDate)

    for (let i = 0; i < this.health_data_list.length; i++) {
      if (this.health_data_list[i].datetime.valueOf() < s.valueOf() || this.health_data_list[i].datetime.valueOf() > e.valueOf()) {
        this.health_data_list.splice(i, 1)
      }
    }
    //Separation
    for (let i = 0; i < this.heartHealth_list.length; i++) {
      if (this.heartHealth_list[i].health_classification < 0.5) {
        this.healthy_list.push(this.heartHealth_list[i])
      }
      else {
        this.notHealthyList.push(this.heartHealth_list[i])
      }
    }
    this.computeAverage(this.healthy_list, this.healthy_values)
    this.computeAverage(this.notHealthyList, this.notHealthy_values)
    this.setRadarChart()

    this.selectMetrics('')

    let l = this.heartHealth_list.length
    let temp: HeartHealth[] = []
    for (let i = 0; i < l; i++) {
      if (this.heartHealth_list[i] != undefined) {
        if (this.heartHealth_list[i].health_data > 0) {
          let healthData = this.findHealthDataFromHeartHealt(this.heartHealth_list[i])
          if (healthData.datetime.valueOf() >= s.valueOf() && healthData.datetime.valueOf() <= e.valueOf()) {
            temp.push(this.heartHealth_list[i])
          }
        }
      }
    }
    this.heartHealth_list = Object.values(temp)

    this.healthy_list = []
    this.notHealthyList = []

    //Separation
    for (let i = 0; i < this.heartHealth_list.length; i++) {
      if (this.heartHealth_list[i].health_data > 0) {
        if (this.heartHealth_list[i].health_classification < 0.5) {
          this.healthy_list.push(this.heartHealth_list[i])
        }
        else {
          this.notHealthyList.push(this.heartHealth_list[i])
        }
      }
    }

    this.metricList1 = []
    this.metricList2 = []
    this.metricCounter1 = []
    this.metricCounter2 = []
    this.defineCounter(this.notHealthyList, this.metricList1, this.metricCounter1, this.selectedMetricBC1)
    this.defineCounter(this.notHealthyList, this.metricList2, this.metricCounter2, this.selectedMetricBC2)
    this.setBarChart(this.metricList1, this.metricCounter1, this.metricList2, this.metricCounter2)
  }

  defineCounter(list: HeartHealth[], value: string[], occurrence: number[], metric: string) {
    if (list.length == 0) {
      value.push('no item')
      occurrence.push(0)
    } else {
      var value1: number[] = []
      if (metric == 'ECG') {
        for (let i = 0; i < list.length; i++) {
          if (list[i].health_data > 0) { //si riferisce ad una persona
            value1.push(list[i].ecg_classification)
          }
        }
        value1.sort(function (a, b) { return a - b });
        let a = value1[0]
        let j = 0
        occurrence[j] = 1
        if (a == 0) {
          value.push("Normal")
        } else if (a == 1) {
          value.push("ST-T wave anomaly")
        } else if (a == 2) {
          value.push("left ventricular hypertrophy")
        } else {
          value.push(a.toString())
        }
        for (let i = 1; i < value1.length; i++) {
          if (value1[i] != a) {
            j += 1
            a = value1[i]
            occurrence[j] = 1
            if (a == 0) {
              value.push("Normal")
            } else if (a == 1) {
              value.push("ST-T wave anomaly")
            } else if (a == 2) {
              value.push("left ventricular hypertrophy")
            } else {
              value.push(a.toString())
            }
          }
          else {
            occurrence[j] += 1
          }
        }
      } else if (metric == 'ST') {
        for (let i = 0; i < list.length; i++) {
          if (list[i].health_data > 0) { //si riferisce ad una persona
            value1.push(list[i].ST_depress_induced_by_exercise_relative_to_rest)
          }
        }
        value1.sort(function (a, b) { return a - b });
        let a = value1[0]
        let j = 0
        occurrence[j] = 1

        value.push(a.toString())

        for (let i = 1; i < value1.length; i++) {
          if (value1[i] != a) {
            j += 1
            a = value1[i]
            occurrence[j] = 1
            value.push(a.toString())
          }
          else {
            occurrence[j] += 1
          }
        }
      } else if (metric == 'Chest Pain Type') {
        for (let i = 0; i < list.length; i++) {
          if (list[i].health_data > 0) { //si riferisce ad una persona
            value1.push(list[i].chest_pain_type)
          }
        }
        value1.sort(function (a, b) { return a - b });
        let a = value1[0]
        let j = 0
        occurrence[j] = 1
        if (a == 1) {
          value.push("Typical Angina")
        } else if (a == 2) {
          value.push("Atypical Angina")
        } else if (a == 3) {
          value.push("Non anginal pain")
        } else if (a == 4) {
          value.push("Asymptomatic")
        } else {
          value.push(a.toString())
        }
        for (let i = 1; i < value1.length; i++) {
          if (value1[i] != a) {
            j += 1
            a = value1[i]
            occurrence[j] = 1
            if (a == 1) {
              value.push("Typical Angina")
            } else if (a == 2) {
              value.push("Atypical Angina")
            } else if (a == 3) {
              value.push("Non anginal pain")
            } else if (a == 4) {
              value.push("Asymptomatic")
            } else {
              value.push(a.toString())
            }
          }
          else {
            occurrence[j] += 1
          }
        }
      } else { //age
        for (let i = 0; i < list.length; i++) {
          if (list[i].health_data > 0) { //si riferisce ad una persona
            value1.push(list[i].age)
          }
        }
        value1.sort(function (a, b) { return a - b });
        let a = value1[0]
        let j = 0
        occurrence[j] = 1
        value.push(a.toString())
        for (let i = 1; i < value1.length; i++) {
          if (value1[i] != a) {
            j += 1
            a = value1[i]
            occurrence[j] = 1
            value.push(a.toString())
          }
          else {
            occurrence[j] += 1
          }
        }
      }
    }
  }


  splitDataset(list: HealthData[], healthy: HealthData[], notHealth: HealthData[]) {
    //Splitting
    for (let i = 0; i < list.length; i++) {
      if (list[i].health_classification < 0.5) {
        healthy.push(list[i])
      }
      else {
        notHealth.push(list[i])
      }
    }
    if (healthy.length >= notHealth.length) {
      for (let i = 0; i < healthy.length; i++) {
        this.dates.push(i+1)
      }
    } else {
      for (let i = 0; i < notHealth.length; i++) {
        this.dates.push(i+1)
      }
    }

  }

  selectMetricsBC(metric: string, bc: number) {
    if (bc == 1) {
      this.selectedMetricBC1 = metric
      this.metricCounter1 = []
      this.metricList1 = []
      this.defineCounter(this.notHealthyList, this.metricList1, this.metricCounter1, metric)
    } else if (bc == 2) {
      this.metricCounter2 = []
      this.metricList2 = []
      this.selectedMetricBC2 = metric
      this.defineCounter(this.notHealthyList, this.metricList2, this.metricCounter2, metric)
    }
    this.setBarChart(this.metricList1, this.metricCounter1, this.metricList2, this.metricCounter2)
  }

  selectMetrics(metric: string) {
    this.selectedMetricHealthyList = []
    this.selectedMetricNotHealthyList = []
    this.healthy_data_list = []
    this.notHealthy_data_list = []
    this.dates = []
    this.selectedMetric = metric
    this.splitDataset(this.health_data_list, this.healthy_data_list, this.notHealthy_data_list)

    if (metric == 'Anion Gap') {
      for (let i = 0; i < this.healthy_data_list.length; i++) {
        this.selectedMetricHealthyList.push(this.healthy_data_list[i].anion_gap)
      }
      for (let i = 0; i < this.notHealthy_data_list.length; i++) {
        this.selectedMetricNotHealthyList.push(this.notHealthy_data_list[i].anion_gap)
      }
    } else if (metric == 'Systole') {
      for (let i = 0; i < this.healthy_data_list.length; i++) {
        this.selectedMetricHealthyList.push(this.healthy_data_list[i].systole)
      }
      for (let i = 0; i < this.notHealthy_data_list.length; i++) {
        this.selectedMetricNotHealthyList.push(this.notHealthy_data_list[i].systole)
      }
    } else if (metric == 'Bmi') {
      for (let i = 0; i < this.healthy_data_list.length; i++) {
        this.selectedMetricHealthyList.push(this.healthy_data_list[i].bmi)
      }
      for (let i = 0; i < this.notHealthy_data_list.length; i++) {
        this.selectedMetricNotHealthyList.push(this.notHealthy_data_list[i].bmi)
      }
    } else if (metric == 'Bicarbonate') {
      for (let i = 0; i < this.healthy_data_list.length; i++) {
        this.selectedMetricHealthyList.push(this.healthy_data_list[i].bicarbonate)
      }
      for (let i = 0; i < this.notHealthy_data_list.length; i++) {
        this.selectedMetricNotHealthyList.push(this.notHealthy_data_list[i].bicarbonate)
      }
    }
    else if (metric == 'Breathing Rate') {
      for (let i = 0; i < this.healthy_data_list.length; i++) {
        this.selectedMetricHealthyList.push(this.healthy_data_list[i].breathing_rate)
      }
      for (let i = 0; i < this.notHealthy_data_list.length; i++) {
        this.selectedMetricNotHealthyList.push(this.notHealthy_data_list[i].breathing_rate)
      }
    }
    else {
      for (let i = 0; i < this.healthy_data_list.length; i++) {
        this.selectedMetricHealthyList.push(this.healthy_data_list[i].heartbeat)
      }
      for (let i = 0; i < this.notHealthy_data_list.length; i++) {
        this.selectedMetricNotHealthyList.push(this.notHealthy_data_list[i].heartbeat)
      }
    }
    this.setLineChart()
  }

  setBarChart(metricList1: string[], metricCounter1: number[], metricList2: string[], metricCounter2: number[]): void {
    //Barchart
    this.healthBarCharData = {
      labels: metricList1,
      datasets: [
        {
          data: metricCounter1,
          backgroundColor: 'rgb(54, 162, 235)'
        }
      ]
    };

    this.healthBarChartOption = {
      responsive: true,
    };

    this.healthBarCharData1 = {
      labels: metricList2,
      datasets: [
        {
          data: metricCounter2,
          backgroundColor: 'rgb(54, 162, 235)'
        }
      ]
    };

    this.healthBarChartOption1 = {
      responsive: true,
    };
  }

  setRadarChart() {
    this.radarChartOptions = {
      responsive: false,
    };
    this.radarChartLabels = ['Age', 'sex', 'Blood Pressure', 'Serum Cholestoral', 'Heartbeat'];
    this.radarChartDatasets = [
      { data: this.healthy_values, label: 'Healthy' },
      { data: this.notHealthy_values, label: 'Not Healthy' }
    ];


  }

  setLineChart() {
    this.lineChartData = {
      labels: this.dates,
      datasets: [
        {
          data: this.selectedMetricHealthyList,
          label: 'Healthy',
          fill: true,
          tension: 0.5,
          borderColor: 'black',
          backgroundColor: 'rgba(255,0,0,0.3)'
        },
        {
          data: this.selectedMetricNotHealthyList,
          label: 'Not Healthy',
          fill: true,
          tension: 0.5,
          borderColor: 'black',
          backgroundColor: 'rgba(0,125,255,0.3)'
        }
      ]
    };
  }

  unset(){
    sessionStorage.setItem("id","")
    sessionStorage.setItem("jwt","")
    sessionStorage.setItem("type","")
  }


}
