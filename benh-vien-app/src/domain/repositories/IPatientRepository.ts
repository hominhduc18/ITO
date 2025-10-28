import {PatientEntity} from "../entities/PatientEntity.ts";
import type {Patient} from "../entities/Patient.ts";

export interface IPatientRepository {
    getAll(): Promise<PatientEntity[]>;  //hành động bất đồng bộ (sẽ hoàn thành trong tương lai)
    getById(id: string): Promise<PatientEntity>;
    getByStatus(id: string): Promise<PatientEntity>;
    getByDepartment(id: string): Promise<PatientEntity[]>;
    search(search: string): Promise<PatientEntity[]>;


    create(patient: Patient): Promise<PatientEntity>;
    update(id: string, patient: Partial<PatientEntity>): Promise<PatientEntity>;
    delete(id: string): Promise<void>;

    updateStatus(id: string, status: PatientEntity['status']): Promise<PatientEntity>;
    assignDoctor(id: string, doctor: string): Promise<PatientEntity>;



}