import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { HealthData } from 'src/app/models/health-data';
import { MortalityData } from 'src/app/models/mortality-data';
import { HealthDataService } from 'src/app/services/health-data.service';
import { MortalityService } from 'src/app/services/mortality.service';

@Component({
  selector: 'app-mortality',
  templateUrl: './mortality.component.html',
  styleUrls: ['./mortality.component.scss']
})
export class MortalityComponent implements OnInit {

  public radarChartOptions: ChartConfiguration<'radar'>['options'] = {}
  public radarChartLabels: string[] = []
  public radarChartDatasets: ChartConfiguration<'radar'>['data']['datasets'] = [];

  public barChartLegend = false;
  public barChartPlugins = [];
  public healthBarCharData: ChartConfiguration<'bar'>['data'] = { datasets: [] };
  public healthBarChartOption: ChartConfiguration<'bar'>['options'] = {};
  public healthBarCharData1: ChartConfiguration<'bar'>['data'] = { datasets: [] };
  public healthBarChartOption1: ChartConfiguration<'bar'>['options'] = {};

  public lineChartData: ChartConfiguration<'line'>['data'] = { datasets: [] };
  public lineChartOptions: ChartOptions<'line'> = { responsive: false };
  public lineChartLegend = true;

  mortalityEntry_list: MortalityData[] = []
  mortalityEntry_list_fromBE: MortalityData[] = []
  healthyMortalityData: MortalityData[] = []
  notHealthyMortalityData: MortalityData[] = []
  healthyMortalityValues: number[] = [0,0,0,0,0,0,0,0,0,0,0,0,0]
  notHealthyMortalityValues: number[] = [0,0,0,0,0,0,0,0,0,0,0,0,0]

  metricCounter1: number[] = []
  metricList1: string[] = []
  metricCounter2: number[] = []
  metricList2: string[] = []

  health_data_list: HealthData[] = []
  healthy_data_list: HealthData[] = []
  notHealthy_data_list: HealthData[] = []
  health_data_list_from_be: HealthData[] = [];

  selectedMetricHealthyList: number[] = []
  selectedMetricNotHealthyList: number[] = []
  dates: number[] = []

  selectedMetric = ''
  selectedMetricBC1 = ''
  selectedMetricBC2 = ''

  public startDate: Date = new Date;
  public endDate: Date = new Date;

  constructor(private mortalityService: MortalityService, private healthDataService: HealthDataService) { }

  ngOnInit(): void {
    if(sessionStorage.getItem("type")=="doctor"){
    this.selectedMetric = 'Heartbeat' //for lin chart
    this.selectedMetricBC1 = 'sex'    //for bar chart 1
    this.selectedMetricBC2 = 'sex'    //for bar chart 2

    this.mortalityService.getAllMortalityData().subscribe(data => {
      this.mortalityEntry_list = data
      this.mortalityEntry_list_fromBE = data

      //Separation healthy and not healthy
      for (let i = 0; i < this.mortalityEntry_list.length; i++) {
        if (this.mortalityEntry_list[i].health_data > 0) {
          if (this.mortalityEntry_list[i].mortality_risk < 0.5) {
            this.healthyMortalityData.push(this.mortalityEntry_list[i])
          }
          else {
            this.notHealthyMortalityData.push(this.mortalityEntry_list[i])
          }
        }
      }
      console.log(this.notHealthyMortalityData)
      this.computeAverage(this.healthyMortalityData, this.healthyMortalityValues)
      this.computeAverage(this.notHealthyMortalityData, this.notHealthyMortalityValues)
      this.setRadarChart()

      this.defineCounter(this.notHealthyMortalityData, this.metricList1, this.metricCounter1, 'sex')
      this.defineCounter(this.notHealthyMortalityData, this.metricList2, this.metricCounter2, 'sex')
      this.setBarChart(this.metricList1, this.metricCounter1, this.metricList2, this.metricCounter2)

    })

    this.healthDataService.getAllHealthData().subscribe(data => {
      this.health_data_list = data
      this.health_data_list_from_be = data
      for (let i = 0; i < this.health_data_list.length; i++) {
        this.health_data_list[i].datetime = new Date(this.health_data_list[i].datetime)
      }
      this.selectMetrics(this.selectedMetric)
    });
  }
  }

  unset(){
    sessionStorage.setItem("id","")
    sessionStorage.setItem("jwt","")
    sessionStorage.setItem("type","")
  }


  filterData() {
    this.health_data_list = Object.values(this.health_data_list_from_be);
    this.mortalityEntry_list = Object.values(this.mortalityEntry_list_fromBE);

    let s = new Date(this.startDate)
    let e = new Date(this.endDate)

    for (let i = 0; i < this.health_data_list.length; i++) {
      if (this.health_data_list[i].datetime.valueOf() < s.valueOf() || this.health_data_list[i].datetime.valueOf() > e.valueOf()) {
        this.health_data_list.splice(i, 1)
      }
    }
    //Separation
    for (let i = 0; i < this.mortalityEntry_list.length; i++) {
      if (this.mortalityEntry_list[i].mortality_risk < 0.5) {
        this.healthyMortalityData.push(this.mortalityEntry_list[i])
      }
      else {
        this.notHealthyMortalityData.push(this.mortalityEntry_list[i])
      }
    }
    this.computeAverage(this.healthyMortalityData, this.healthyMortalityValues)
    this.computeAverage(this.notHealthyMortalityData, this.notHealthyMortalityValues)
    this.setRadarChart()

    this.selectMetrics('Heartbeat')

    let l = this.mortalityEntry_list.length
    let temp: MortalityData[] = []
    for (let i = 0; i < l; i++) {
      if (this.mortalityEntry_list[i] != undefined) {
        if (this.mortalityEntry_list[i].health_data > 0) {
          let healthData = this.findHealthDataFromHeartHealt(this.mortalityEntry_list[i])
          if (healthData.datetime.valueOf() >= s.valueOf() && healthData.datetime.valueOf() <= e.valueOf()) {
            temp.push(this.mortalityEntry_list[i])
          }
        }
      }
    }
    this.mortalityEntry_list = Object.values(temp)

    this.healthyMortalityData = []
    this.notHealthyMortalityData = []

    for (let i = 0; i < this.mortalityEntry_list.length; i++) {
      if (this.mortalityEntry_list[i].health_data > 0) {
        if (this.mortalityEntry_list[i].mortality_risk < 0.5) {
          this.healthyMortalityData.push(this.mortalityEntry_list[i])
        }
        else {
          this.notHealthyMortalityData.push(this.mortalityEntry_list[i])
        }
      }
    }

    this.metricList1 = []
    this.metricList2 = []
    this.metricCounter1 = []
    this.metricCounter2 = []
    this.defineCounter(this.notHealthyMortalityData, this.metricList1, this.metricCounter1, this.selectedMetricBC1)
    this.defineCounter(this.notHealthyMortalityData, this.metricList2, this.metricCounter2, this.selectedMetricBC2)
    this.setBarChart(this.metricList1, this.metricCounter1, this.metricList2, this.metricCounter2)
}

  findHealthDataFromHeartHealt(mortalityData: MortalityData): HealthData {
    for (let j = 0; j < this.health_data_list.length; j++) {
      if (this.health_data_list[j].id == mortalityData.health_data) {
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


  computeAverage(list: MortalityData[], values: number[]) {
    for (let i = 0; i < list.length; i++) {
      values[0] += list[i].age
      values[1] += list[i].sex
      values[2] += list[i].anion_gap
      values[3] += list[i].bicarbonate
      values[4] += list[i].heartbeat
      values[5] += list[i].blood_glucose
      values[6] += list[i].bmi
      values[7] += list[i].diastole
      values[8] += list[i].systole
      values[9] += list[i].lactic_acid
      values[10] += list[i].leucocyte
      values[11] += list[i].oxygen_saturation
      values[12] += list[i].temperature
    }
    for (let i = 0; i < values.length; i++) {
      values[i] = values[i] / (list.length)
    }
  }

  defineCounter(list: MortalityData[], value: string[], occurrence: number[], metric: string) {
    if (list.length == 0) {
      value.push('no item')
      occurrence.push(0)
    } else {
      var value1: number[] = []
      if (metric == 'hyperthensive') {
        for (let i = 0; i < list.length; i++) {
          if (list[i].health_data > 0 ) { //si riferisce ad una persona
            value1.push(list[i].hypertensive)
          }
        }
        value1.sort(function (a, b) { return a - b });
        let a = value1[0]
        let j = 0
        occurrence[j] = 1
        if (a == 0) {
          value.push("No")
        } else if (a == 1) {
          value.push("Yes")
        } else {
          value.push(a.toString())
        }
        for (let i = 1; i < value1.length; i++) {
          if (value1[i] != a) {
            j += 1
            a = value1[i]
            occurrence[j] = 1
            if (a == 0) {
              value.push("No")
            } else if (a == 1) {
              value.push("Yes")
            }else {
              value.push(a.toString())
            }
          }
          else {
            occurrence[j] += 1
          }
        }
      } else if (metric == 'diabetes') {
        for (let i = 0; i < list.length; i++) {
          if (list[i].health_data > 0) { //si riferisce ad una persona
            value1.push(list[i].diabetes)
          }
        }
        value1.sort(function (a, b) { return a - b });
        let a = value1[0]
        let j = 0
        occurrence[j] = 1

        if (a == 0) {
          value.push("No")
        } else if (a == 1) {
          value.push("Yes")
        } else {
          value.push(a.toString())
        }

        for (let i = 1; i < value1.length; i++) {
          if (value1[i] != a) {
            j += 1
            a = value1[i]
            occurrence[j] = 1
            if (a == 0) {
              value.push("No")
            } else if (a == 1) {
              value.push("Yes")
            } else {
              value.push(a.toString())
            }
          }
          else {
            occurrence[j] += 1
          }
        }
      } else if (metric == 'sex') {
        for (let i = 0; i < list.length; i++) {
          if (list[i].health_data > 0) { //si riferisce ad una persona
            value1.push(list[i].sex)
          }
        }
        value1.sort(function (a, b) { return a - b });
        let a = value1[0]
        let j = 0
        occurrence[j] = 1
        if (a == 1) {
          value.push("Man")
        } else if (a == 0) {
          value.push("Woman")
        }  else {
          value.push(a.toString())
        }
        for (let i = 1; i < value1.length; i++) {
          if (value1[i] != a) {
            j += 1
            a = value1[i]
            occurrence[j] = 1
            if (a == 1) {
              value.push("Man")
            } else if (a == 0) {
              value.push("Woman")
            }  else {
              value.push(a.toString())
            }
          }
          else {
            occurrence[j] += 1
          }
        }
      }
    }
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
    } else if (metric == 'Diastole') {
      for (let i = 0; i < this.healthy_data_list.length; i++) {
        this.selectedMetricHealthyList.push(this.healthy_data_list[i].diastole)
      }
      for (let i = 0; i < this.notHealthy_data_list.length; i++) {
        this.selectedMetricNotHealthyList.push(this.notHealthy_data_list[i].diastole)
      }
    }else if (metric == 'Bmi') {
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
    else if(metric=='Heartbeat'){
      for (let i = 0; i < this.healthy_data_list.length; i++) {
        this.selectedMetricHealthyList.push(this.healthy_data_list[i].heartbeat)
      }
      for (let i = 0; i < this.notHealthy_data_list.length; i++) {
        this.selectedMetricNotHealthyList.push(this.notHealthy_data_list[i].heartbeat)
      }
    }
    this.setLineChart()
  }

  selectMetricsBC(metric: string, bc: number) {
    if (bc == 1) {
      this.selectedMetricBC1 = metric
      this.metricCounter1 = []
      this.metricList1 = []
      this.defineCounter(this.notHealthyMortalityData, this.metricList1, this.metricCounter1, metric)
    } else if (bc == 2) {
      this.metricCounter2 = []
      this.metricList2 = []
      this.selectedMetricBC2 = metric
      this.defineCounter(this.notHealthyMortalityData, this.metricList2, this.metricCounter2, metric)
    }
    this.setBarChart(this.metricList1, this.metricCounter1, this.metricList2, this.metricCounter2)
  }

  splitDataset(list: HealthData[], healthy: HealthData[], notHealth: HealthData[]) {
    //Splitting
    for (let i = 0; i < list.length; i++) {
      if (list[i].mortality_risk < 0.5) {
        healthy.push(list[i])
      }
      else {
        notHealth.push(list[i])
      }
    }
    if (healthy.length >= notHealth.length) {
      for (let i = 0; i < healthy.length; i++) {
        this.dates.push(i)
      }
    } else {
      for (let i = 0; i < notHealth.length; i++) {
        this.dates.push(i)
      }
    }

  }

  setRadarChart() {
    this.radarChartOptions = {
      responsive: false,
    };
    this.radarChartLabels = ['Age', 'sex', 'Anion Gap','Bicarbonate','Heartbeat','Glucose','BMI','Diastole','Systole','Lactic Acid','Leucocyte','Oxygen Saturation','Temperature'];
    this.radarChartDatasets = [
      { data: this.healthyMortalityValues, label: 'Low Porbability of Dead' },
      { data: this.notHealthyMortalityValues, label: 'High Probability of Dead' }
    ];


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

  setLineChart() {
    this.lineChartData = {
      labels: this.dates,
      datasets: [
        {
          data: this.selectedMetricHealthyList,
          label: 'Low Probability of Dead',
          fill: true,
          tension: 0.5,
          borderColor: 'black',
          backgroundColor: 'rgba(255,0,0,0.3)'
        },
        {
          data: this.selectedMetricNotHealthyList,
          label: 'High Probability of Dead',
          fill: true,
          tension: 0.5,
          borderColor: 'black',
          backgroundColor: 'rgba(0,125,255,0.3)'
        }
      ]
    };
  }

}
