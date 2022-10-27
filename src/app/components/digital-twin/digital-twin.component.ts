import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { EcgEntry } from 'src/app/models/ecg-entry';
import { HealthData } from 'src/app/models/health-data';
import { Patient } from 'src/app/models/patient';
import { HealthDataService } from 'src/app/services/health-data.service';
import { MortalityService } from 'src/app/services/mortality.service';
import { PatientService } from 'src/app/services/patient.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-digital-twin',
  templateUrl: './digital-twin.component.html',
  styleUrls: ['./digital-twin.component.scss']
})
export class DigitalTwinComponent implements OnInit {

  allHealthPatientData: HealthData[] = []
  patient: Patient = {
    id: 0,
    name: '',
    surname: '',
    sex: 0,
    hypertensive: 0,
    diabetes: 0,
    username: '',
    profile_photo: '',
    birthday: new Date(),
    fiscal_code: '',
    phone_number: 0,
    email: '',
    doctors: [],
    show: false,
    password: ''
  }
  hospitalizationRisk = 0
  probabilityOfDead = 0
  healthClassification = 0
  modifiedHealthData: HealthData = {
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
  ecg_entry_list: EcgEntry[] = []

  updateData = false
  HR_realTime: number = 0
  BR_realtTime: number = 0
  SpO2_realTime: number = 0
  temperature_realTime: number = 0
  hrv_realTime: number = 0
  todaySteps: number = 0
  todayCalories: number = 0
  todayFloors: number = 0
  todayDistance: number = 0
  actualBMI: number = 0

  newAnalysis: boolean = false

  lastMonthSteps: number[] = []

  newHealthData: HealthData = {
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

  public lineChartData: ChartConfiguration<'line'>['data'] = { datasets: [] };
  public lineChartOptions: ChartOptions<'line'> = { responsive: false };
  public lineChartLegend = true;

  public lineChartDTData: ChartConfiguration<'line'>['data'] = { datasets: [] };
  public lineChartDTOptions: ChartOptions<'line'> = { responsive: false };
  public lineChartDTLegend = true;

  public barChartLegend = true;
  public barChartPlugins = [];
  public healthBarCharData: ChartConfiguration<'bar'>['data'] = { datasets: [] };
  public healthBarChartOption: ChartConfiguration<'bar'>['options'] = {};

  constructor(private healthDataService: HealthDataService, private utilityService: UtilityService, private mortalityService: MortalityService, private readonly router: Router,
              private patientService: PatientService) { }

  unset() {
    sessionStorage.setItem("id", "")
    sessionStorage.setItem("jwt", "")
    sessionStorage.setItem("type", "")
  }

  ngOnInit(): void {
    if (sessionStorage.getItem("type") == 'doctor') {
      this.patient = this.utilityService.patient
      this.utilityService.patient = this.patient
      this.healthDataService.getAllHeathDataOfPatient(this.patient.id.toString()).subscribe(data => {
        this.allHealthPatientData = data
        for (let i = 0; i < this.allHealthPatientData.length; i++) {
          this.healthDataService.getEcgEntry(this.allHealthPatientData[i].id).subscribe(data => {
            this.ecg_entry_list.push(data)
          })
        }
        let lastDate = new Date(-9999999999)
        for (let i = 0; i < this.allHealthPatientData.length; i++) {
          this.allHealthPatientData[i].update = false
          let d = new Date(this.allHealthPatientData[i].datetime)
          this.allHealthPatientData[i].showECG = false
          this.allHealthPatientData[i].datetime = d
          this.allHealthPatientData[i].stringDate = d.getDate().toString() + '/' + (d.getMonth() + 1).toString() + '/' + d.getFullYear().toString()
          if (lastDate < this.allHealthPatientData[i].datetime) {
            lastDate = this.allHealthPatientData[i].datetime
            this.hospitalizationRisk = parseFloat(this.allHealthPatientData[i].hospitalization_risk.toFixed(2)) * 100
            this.probabilityOfDead = parseFloat(this.allHealthPatientData[i].mortality_risk.toFixed(2)) * 100
            this.healthClassification = parseFloat((1 - this.allHealthPatientData[i].health_classification).toFixed(2)) * 100
          }
        }
        //Algoritmo di ordinamento rispetto alla data di acquisizone: da ridurre la complessità
        let orderedHealthData: HealthData[] = []
        let orderedECG: EcgEntry[] = []
        lastDate = new Date(-9999999999)
        for (let j = 0; j < this.allHealthPatientData.length; j++) {
          if (lastDate < this.allHealthPatientData[j].datetime) {
            orderedHealthData.unshift(this.allHealthPatientData[j])
          }
          //}
        }
        this.allHealthPatientData = orderedHealthData

      });
    }
    this.healthDataService.getHeartRate().subscribe(data => {
      this.HR_realTime = data['activities-heart-intraday']['dataset'].pop()['value']
      let l: number[] = []
      let v: number[] = []
      for (let i = 0; i < data['activities-heart-intraday']['dataset'].length; i++) {
        l.push(data['activities-heart-intraday']['dataset'][i]['time'])
        v.push(data['activities-heart-intraday']['dataset'][i]['value'])
      }
      this.lineChartDTData = {
        labels: l,
        datasets: [
          {
            label: 'Heart rhythm course [Bpm]',
            data: v,
            fill: true,
            tension: 0,
            borderColor: 'black',
            backgroundColor: 'rgba(0,0,255,0.5)',
            pointBackgroundColor: 'rgba(0,0,0,0)',
            pointBorderColor: 'rgba(0,0,0,0)',
            borderWidth: 1,
            xAxisID: 'Time',
            yAxisID: 'Bpm'
          }
        ]
      };
    })
    this.healthDataService.getBreathingRate().subscribe(data => {
      this.BR_realtTime = data['br'][0]['value']['breathingRate']
    })
    this.healthDataService.getSpO2().subscribe(data => {
      this.SpO2_realTime = data['value']['max']
    })
    this.healthDataService.getHRV().subscribe(data => {
      this.hrv_realTime = data['hrv'][0]['value']['dailyRmssd']
    })

    let dates: string[] = []
    this.healthDataService.getSteps().subscribe(data => {
      for (let i = 0; i < data['activities-steps'].length; i++) {
        this.lastMonthSteps.push(data['activities-steps'][i]['value'])
        dates.push(data['activities-steps'][i]['dateTime'])
      }

      this.healthBarCharData = {
        labels: dates,
        datasets: [
          {
            data: this.lastMonthSteps,
            backgroundColor: 'rgba(0,0,255,0.5)',
            label: 'Steps in last month'
          }
        ]
      };

      this.healthBarChartOption = {
        responsive: true,
      };

      this.todaySteps = data['activities-steps'].pop()['value']
    })

    this.healthDataService.getDayliSummary().subscribe(data => {
      this.todayCalories = data['summary']['caloriesOut']
      this.todayFloors = data['summary']['floors']
      this.todayDistance = data['summary']['distances'][0]['distance']
    })

    this.healthDataService.getFitbitProfile().subscribe(data => {
      let height = data['user']['height']
      let weight = data['user']['weight']
      this.actualBMI = parseFloat((weight / (height * height)).toFixed(2))
    })
  }

  updateECG(item: HealthData, newClass: number) {
    let ecg_entry: EcgEntry = {
      id: 0,
      value: [],
      ECG_classification: 0,
      health_data: 0
    }
    for (let i = 0; i < this.ecg_entry_list.length; i++) {
      if (this.ecg_entry_list[i].health_data == item.id) {
        ecg_entry = this.ecg_entry_list[i]
      }
    }
    ecg_entry.ECG_classification = newClass
    this.healthDataService.updateECG(ecg_entry).subscribe(data => {
      for (let i = 0; i < this.ecg_entry_list.length; i++) {
        if (this.ecg_entry_list[i].health_data == item.id) {
          this.ecg_entry_list[i] = data
          break
        }
      }
      item.ECG_classification = newClass

      let healthParam: string[] = []

      //COMPUTE HEALTH CLASSIFICATION
      this.healthDataService.getHealthClassificationParam().subscribe(data => {
        healthParam = data
        //remove precision score
        healthParam.shift()

        //define x
        let x: number[] = []
        x.push(1)
        let today = new Date()
        let b = new Date(this.patient.birthday)
        x.push(today.getFullYear() - b.getFullYear())
        x.push(this.patient.sex)
        x.push(item.chest_pain_type)
        x.push(item.systole)
        x.push(item.serum_cholestoral)
        if (item.blood_glucose > 120) {
          x.push(1)
        } else {
          x.push(0)
        }
        if (item.ECG_classification == 1) {
          x.push(0)
        } else if (item.ECG_classification == 3) {
          x.push(1)
        } else {
          x.push(2)
        }
        x.push(item.heartbeat)
        x.push(item.exercise_induced_angina)
        x.push(item.ST_depress_induced_by_exercise_relative_to_rest)

        //compute product
        let res = 0
        for (let i = 0; i < x.length; i++) {
          res += parseFloat(healthParam[i]) * x[i]
        }
        let clas = 1 / (1 + Math.exp(-res))
        item.health_classification = parseFloat(clas.toFixed(2));


        //COMPUTE MORTALITY CLASSIFICATION
        this.mortalityService.getMortalityClassParam().subscribe(data => {
          let mortalityParam = data
          //delete precision
          mortalityParam.shift()

          //define x
          let x: number[] = []
          x.push(1)
          let today = new Date()
          let b = new Date(this.patient.birthday)
          x.push(today.getFullYear() - b.getFullYear())
          if (this.patient.sex == 0) {
            x.push(2)
          } else {
            x.push(1)
          }
          x.push(item.bmi)
          x.push(this.patient.hypertensive)
          x.push(item.atrial_fibrillation)
          x.push(this.patient.diabetes)
          x.push(item.heartbeat)
          x.push(item.systole)
          x.push(item.diastole)
          x.push(item.breathing_rate)
          x.push(item.temperature)
          x.push(item.oxygen_saturation)
          x.push(item.leucocyte)
          x.push(item.urea_nitrogen)
          x.push(item.blood_glucose)
          x.push(item.anion_gap)
          x.push(item.bicarbonate)
          x.push(item.lactic_acid)

          let res = 0
          for (let i = 0; i < x.length; i++) {
            res += parseFloat(mortalityParam[i]) * x[i]
          }
          let clas = 1 / (1 + Math.exp(-res))
          item.mortality_risk = parseFloat(clas.toFixed(2));


          this.healthDataService.updateHealthData(item).subscribe(data => {
            for (let i = 0; i < this.allHealthPatientData.length; i++) {
              if (this.allHealthPatientData[i].id == item.id) {
                this.allHealthPatientData[i] = data
                break
              }
            }
            this.setLineChart(data.id)
          })
        })

      })

    })
  }

  insertHealthData() {
    this.newHealthData.heartbeat = this.HR_realTime
    this.newHealthData.systole = this.allHealthPatientData[0].systole
    this.newHealthData.diastole = this.allHealthPatientData[0].diastole
    this.newHealthData.oxygen_saturation = this.SpO2_realTime
    this.newHealthData.breathing_rate = this.BR_realtTime
    this.newHealthData.blood_glucose = this.allHealthPatientData[0].blood_glucose
    this.newHealthData.temperature = this.allHealthPatientData[0].temperature
    this.newHealthData.chest_pain_type = this.allHealthPatientData[0].chest_pain_type
    this.newHealthData.exercise_induced_angina = this.allHealthPatientData[0].exercise_induced_angina
    this.newHealthData.bmi = this.actualBMI
    this.newHealthData.atrial_fibrillation = this.allHealthPatientData[0].atrial_fibrillation
    this.newHealthData.mortality_risk = this.allHealthPatientData[0].mortality_risk
    this.newHealthData.ECG_classification = this.allHealthPatientData[0].ECG_classification
    this.newHealthData.hospitalization_risk = this.allHealthPatientData[0].hospitalization_risk
    this.newHealthData.patient = this.allHealthPatientData[0].patient
    this.newHealthData.hide = false
    this.newHealthData.update = false
    this.newHealthData.showECG = false

    let healthParam: string[] = []

    //COMPUTE HEALTH CLASSIFICATION
    this.healthDataService.getHealthClassificationParam().subscribe(data => {
      healthParam = data
      //remove precision score
      healthParam.shift()

      //define x
      let x: number[] = []
      x.push(1)
      let today = new Date()
      let b = new Date(this.patient.birthday)
      x.push(today.getFullYear() - b.getFullYear())
      x.push(this.patient.sex)
      x.push(this.newHealthData.chest_pain_type)
      x.push(this.newHealthData.systole)
      x.push(this.newHealthData.serum_cholestoral)
      if (this.newHealthData.blood_glucose > 120) {
        x.push(1)
      } else {
        x.push(0)
      }
      if (this.newHealthData.ECG_classification == 1) {
        x.push(0)
      } else if (this.newHealthData.ECG_classification == 3) {
        x.push(1)
      } else {
        x.push(2)
      }
      x.push(this.newHealthData.heartbeat)
      x.push(this.newHealthData.exercise_induced_angina)
      x.push(this.newHealthData.ST_depress_induced_by_exercise_relative_to_rest)

      //compute product
      let res = 0
      for (let i = 0; i < x.length; i++) {
        res += parseFloat(healthParam[i]) * x[i]
      }
      let clas = 1 / (1 + Math.exp(-res))
      this.newHealthData.health_classification = parseFloat(clas.toFixed(2));


      //COMPUTE MORTALITY CLASSIFICATION
      this.mortalityService.getMortalityClassParam().subscribe(data => {
        let mortalityParam = data
        //delete precision
        mortalityParam.shift()

        //define x
        let x: number[] = []
        x.push(1)
        let today = new Date()
        let b = new Date(this.patient.birthday)
        x.push(today.getFullYear() - b.getFullYear())
        if (this.patient.sex == 0) {
          x.push(2)
        } else {
          x.push(1)
        }
        x.push(this.newHealthData.bmi)
        x.push(this.patient.hypertensive)
        x.push(this.newHealthData.atrial_fibrillation)
        x.push(this.patient.diabetes)
        x.push(this.newHealthData.heartbeat)
        x.push(this.newHealthData.systole)
        x.push(this.newHealthData.diastole)
        x.push(this.newHealthData.breathing_rate)
        x.push(this.newHealthData.temperature)
        x.push(this.newHealthData.oxygen_saturation)
        x.push(this.newHealthData.leucocyte)
        x.push(this.newHealthData.urea_nitrogen)
        x.push(this.newHealthData.blood_glucose)
        x.push(this.newHealthData.anion_gap)
        x.push(this.newHealthData.bicarbonate)
        x.push(this.newHealthData.lactic_acid)

        let res = 0
        for (let i = 0; i < x.length; i++) {
          res += parseFloat(mortalityParam[i]) * x[i]
        }
        let clas = 1 / (1 + Math.exp(-res))
        this.newHealthData.mortality_risk = parseFloat(clas.toFixed(2));

        //Recuperare ultimo ecg e associarlo (copia) alla nuovo clinical report e inserisco i nuovi dati nel db

        this.healthDataService.addHealthData(this.newHealthData).subscribe(data => {
          this.newHealthData = data
          this.allHealthPatientData.push(this.newHealthData)
          let lastEcg = {
            "ECG_classification": this.ecg_entry_list[0].ECG_classification,
            "value": this.ecg_entry_list[0].value,
            "health_data": this.newHealthData.id
          }
          this.healthDataService.addEcgData(lastEcg).subscribe(data => {
            this.ecg_entry_list.push(data)

          })
        })


      })
    })
    this.utilityService.patient = this.patient;
    // window.location.reload();
    this.ngOnInit()
  }

  setLineChart(healthId: number) {
    let l: number[] = []
    let c: string = ''
    let ecgEntry: EcgEntry = {
      id: 0,
      value: [],
      ECG_classification: 0,
      health_data: 0
    }

    for (let j = 0; j < this.ecg_entry_list.length; j++) {
      if (this.ecg_entry_list[j].health_data == healthId) {
        ecgEntry = this.ecg_entry_list[j]
        break
      }
    }

    for (let i = 0; i < ecgEntry.value.length; i++) {
      l.push(i + 1)
      switch (ecgEntry.ECG_classification) {
        case 1:
          c = 'Normal ECG'
          break;
        case 2:
          c = 'R-on-T premature ventricular contraction'
          break;
        case 3:
          c = 'premature sopraventricular beat'
          break;
        case 4:
          c = 'premature ventricular contraction'
          break
        default:
          c = ''
          break;
      }
    }

    this.lineChartData = {
      labels: l,
      datasets: [
        {
          label: c,
          data: ecgEntry.value,
          fill: true,
          tension: 0,
          borderColor: 'black',
          backgroundColor: 'rgba(255,0,0,0.3)',
          pointBackgroundColor: 'rgba(0,0,0,0)',
          pointBorderColor: 'rgba(0,0,0,0)',
          borderWidth: 1
        }
      ]
    };
    for (let i = 0; i < this.allHealthPatientData.length; i++) {
      if (this.allHealthPatientData[i].id == healthId) {
        this.allHealthPatientData[i].showECG = !this.allHealthPatientData[i].showECG
      } else {
        this.allHealthPatientData[i].showECG = false
      }
    }
  }

  insertLaboratoryAnalysis() {
    this.newAnalysis = !this.newAnalysis
  }

  setUnsetHypertensive(){
    if(this.patient.hypertensive==0){
      this.patient.hypertensive = 1
    } else {
      this.patient.hypertensive=0
    }
    this.patientService.updatePatient(this.patient).subscribe(data => {
      console.log(data)
    })
  }

  setUnsetDiabetic(){
    if(this.patient.diabetes==0){
      this.patient.diabetes = 1
    } else {
      this.patient.diabetes=0
    }
    this.patientService.updatePatient(this.patient).subscribe(data => {
      console.log(data)
    })
  }
}
