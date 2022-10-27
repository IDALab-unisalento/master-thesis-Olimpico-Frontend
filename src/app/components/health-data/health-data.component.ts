import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HealthData } from 'src/app/models/health-data';
import { HealthDataService } from 'src/app/services/health-data.service';
import { UtilityService } from 'src/app/services/utility.service';
import { ChartConfiguration } from 'chart.js';
import { ChartOptions } from 'chart.js';
import { PatientService } from 'src/app/services/patient.service';
import { Patient } from 'src/app/models/patient';

@Component({
  selector: 'app-health-data',
  templateUrl: './health-data.component.html',
  styleUrls: ['./health-data.component.scss']
})
export class HealthDataComponent implements OnInit {

  health_data_list_from_be: HealthData[] = [];
  health_data_list: HealthData[] = [];
  currentClass = {};
  show: boolean = true;
  enableAdd: boolean = true;
  healthCounter: number[] = []
  mortalityCounter: number[] = []
  ecgCounter: number[] = []
  hospitalizationCounter: number[] = []

  healthGraph: number = 1
  mortalityGraph: number = 1
  ecgGraph: number = 1
  hospitalizationGraph: number = 1

  public barChartLegend = true;
  public barChartPlugins = [];
  public healthBarCharData: ChartConfiguration<'bar'>['data'] = { datasets: [] };
  public healthBarChartOption: ChartConfiguration<'bar'>['options'] = {};
  public mortalityBarCharData: ChartConfiguration<'bar'>['data'] = { datasets: [] };
  public mortalityBarChartOption: ChartConfiguration<'bar'>['options'] = {};
  public ecgBarCharData: ChartConfiguration<'bar'>['data'] = { datasets: [] };
  public ecgBarChartOption: ChartConfiguration<'bar'>['options'] = {};
  public hospitalizationBarCharData: ChartConfiguration<'bar'>['data'] = { datasets: [] };
  public hospitalizationBarChartOption: ChartConfiguration<'bar'>['options'] = {};
  public pieChartOptions: ChartOptions<'pie'> = {}
  public pieChartLabels: Object[] = []
  public pieChartDatasets: any[] = []
  public pieChartLegend: boolean = true
  public pieChartPlugins: any[] = []
  public startDate: Date = new Date;
  public endDate: Date = new Date;

  public patientList: Patient[] = []

  constructor(private health_data_service: HealthDataService, private patientService: PatientService) {
  }

  ngOnInit(): void {
    if (sessionStorage.getItem("type") == "doctor") {
      this.health_data_service.getAllHealthData().subscribe(data => {
        this.health_data_list_from_be = data
        this.health_data_list = this.health_data_list_from_be
        this.defineCounter(this.health_data_list)
        for (let i = 0; i < this.health_data_list.length; i++) {
          this.health_data_list[i].datetime = new Date(this.health_data_list[i].datetime)
        }
        this.patientService.getAllPatient().subscribe(data => {
          this.patientList = data
          this.getLastHealthData()
          this.setBarChart(this.health_data_list)
        });
      });
    }
  }

  setView(type: number): void {
    if (type == 1) {
      if (this.healthGraph == 1) {
        this.healthGraph = 0
      }
      else {
        this.healthGraph = this.healthGraph + 1
      }
    }
    if (type == 2) {
      if (this.mortalityGraph == 1) {
        this.mortalityGraph = 0
      } else {
        this.mortalityGraph = this.mortalityGraph + 1
      }
    }
    if (type == 3) {
      if (this.ecgGraph == 2) {
        this.ecgGraph = 0
      }
      else {
        this.ecgGraph = this.ecgGraph + 1
      }
    }
    if (type == 4) {
      if (this.hospitalizationGraph == 1) {
        this.hospitalizationGraph = 0
      }
      else {
        this.hospitalizationGraph = this.hospitalizationGraph + 1
      }
    }
    this.setBarChart(this.health_data_list)
    this.setPieChart(this.health_data_list)
  }

  unset() {
    sessionStorage.setItem("id", "")
    sessionStorage.setItem("jwt", "")
    sessionStorage.setItem("type", "")
  }

  setBarChart(health_data_list: HealthData[]): void {
    this.defineCounter(health_data_list)
    //Barchart
    this.healthBarCharData = {
      labels: ['Healthy', 'Not Healthy'],
      datasets: [
        {
          data: this.healthCounter,
          label: 'Heart health',
          backgroundColor: 'rgb(54, 162, 235)'
        }
      ]
    };

    this.healthBarChartOption = {
      responsive: true,
    };

    this.mortalityBarCharData = {
      labels: ['Low probability of dead', 'High probability of dead'],
      datasets: [
        {
          data: this.mortalityCounter,
          label: 'Probability of dead',
          backgroundColor: 'rgb(54, 162, 235)'
        }
      ]
    };

    this.mortalityBarChartOption = {
      responsive: true,
    };

    this.ecgBarCharData = {
      labels: ['Normal ECG', ['R-on-T', 'premature ventricular', 'contraction'], ['Premature', 'sopraventricular', 'beat'], ['Premature', 'ventricular contraction']],
      datasets: [
        {
          data: this.ecgCounter,
          label: 'ECG Classification',
          backgroundColor: 'rgb(54, 162, 235)'
        }
      ]
    };

    this.ecgBarChartOption = {
      responsive: true,
    };

    this.hospitalizationBarCharData = {
      labels: ['Low Probability of hospitalization', 'High Probability of hospitalization'],
      datasets: [
        {
          data: this.hospitalizationCounter,
          label: 'Probability of Hospitalization',
          backgroundColor: 'rgb(54, 162, 235)'
        }
      ]
    };

    this.hospitalizationBarChartOption = {
      responsive: true,
    };
  }

  setPieChart(health_data_list: HealthData[]): void {
    this.defineCounter(health_data_list)
    // Pie
    this.pieChartOptions = {
      responsive: false,
    };
    this.pieChartLabels = ['Normal ECG', 'R-on-T premature ventricular contraction', 'premature sopraventricular beat', 'premature ventricular contraction'];
    this.pieChartDatasets = [{
      data: this.ecgCounter
    }];
    this.pieChartLegend = true;
    this.pieChartPlugins = [];
  }

  defineCounter(health_data_list: HealthData[]): void {
    this.healthCounter[0] = 0
    this.healthCounter[1] = 0
    this.mortalityCounter[0] = 0
    this.mortalityCounter[1] = 0
    this.hospitalizationCounter[0] = 0
    this.hospitalizationCounter[1] = 0
    this.ecgCounter[0] = 0
    this.ecgCounter[1] = 0
    this.ecgCounter[2] = 0
    this.ecgCounter[3] = 0
    for (let i = 0; i < health_data_list.length; i++) {
      if (health_data_list[i].health_classification < 0.5) {
        this.healthCounter[0] = this.healthCounter[0] + 1
      }
      else {
        this.healthCounter[1] = this.healthCounter[1] + 1
      }


      if (health_data_list[i].mortality_risk < 0.5) {
        this.mortalityCounter[0] = this.mortalityCounter[0] + 1
      }
      else {
        this.mortalityCounter[1] = this.mortalityCounter[1] + 1
      }



      if (health_data_list[i].ECG_classification == 1) {
        this.ecgCounter[0] = this.ecgCounter[0] + 1
      }
      else if (health_data_list[i].ECG_classification == 2) {
        this.ecgCounter[1] = this.ecgCounter[1] + 1
      }
      else if (health_data_list[i].ECG_classification == 3) {
        this.ecgCounter[2] = this.ecgCounter[2] + 1
      }
      else if (health_data_list[i].ECG_classification == 4) {
        this.ecgCounter[3] = this.ecgCounter[3] + 1
      }


      if (health_data_list[i].hospitalization_risk < 0.5) {
        this.hospitalizationCounter[0] = this.hospitalizationCounter[0] + 1
      }
      else {
        this.hospitalizationCounter[1] = this.hospitalizationCounter[1] + 1
      }
    }
  }

  showHideDetail(item: HealthData) {
    item.hide = !item.hide
  }

  getLastHealthData() {
    let list: HealthData[] = []
    for (let i = 0; i < this.patientList.length; i++) {
      let lastDate = new Date(0)
      let healthData: HealthData = {
        id: 0,
        datetime: new Date(),
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

      for (let j = 0; j < this.health_data_list.length; j++) {
        if (this.health_data_list[j].patient == this.patientList[i].id && this.health_data_list[j].datetime > lastDate) {
          healthData = this.health_data_list[j]
          lastDate = this.health_data_list[i].datetime
        }
      }
      if (healthData.id != 0) {
        list.push(healthData)
      }
    }
    this.health_data_list = list
  }

  filterData() {
    this.health_data_list = Object.values(this.health_data_list_from_be);
    let s = new Date(this.startDate)
    let e = new Date(this.endDate)
    for (let i = 0; i < this.health_data_list.length; i++) {
      if (this.health_data_list[i].datetime.valueOf() < s.valueOf() || this.health_data_list[i].datetime.valueOf() > e.valueOf()) {
        this.health_data_list.splice(i, 1)
      }
    }
    this.setBarChart(this.health_data_list)
    this.setPieChart(this.health_data_list)
  }

}
