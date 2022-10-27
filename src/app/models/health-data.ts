export interface HealthData {

    id:number
    datetime:Date
    stringDate?: string
    heartbeat:number
    systole:number
    diastole:number
    oxygen_saturation:number
    breathing_rate:number
    blood_glucose:number
    temperature:number
    chest_pain_type:number
    serum_cholestoral:number
    exercise_induced_angina:number
    ST_depress_induced_by_exercise_relative_to_rest:number
    health_classification:number
    bmi:number
    atrial_fibrillation:number
    leucocyte:number
    urea_nitrogen:number
    anion_gap:number
    bicarbonate:number
    lactic_acid:number
    mortality_risk:number
    ECG_classification:number
    hospitalization_risk:number
    patient:number
    hide?:boolean
    update?:boolean
    showECG?:boolean
}


