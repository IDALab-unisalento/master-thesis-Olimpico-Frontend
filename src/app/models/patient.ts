export interface Patient {
    id:number
    name:string
    surname:string
    sex:number
    hypertensive:number
    diabetes:number
    username:string
    password:string
    profile_photo:string
    birthday:Date
    fiscal_code:string
    phone_number:number
    email:string
    doctors:number[]
    show: boolean

}