export interface Doctor {
    id:number
    name: string
    surname: string
    username: string
    password?: string
    profile_photo: string
    birthday: string
    specialization: string
    phone_number: string
    email:string
    hospital: number
    patients: number[]
}