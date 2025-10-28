import {Patient} from "./Patient.ts";
//khowir tao tu class

// neeu khoong cos publioc trong contructor
//     constructor(id: string, fullName: string) {
// this.id = id;
// this.fullName = fullName;
//  }

export class PatientEntity implements Patient {
    constructor(
        public id: string,
        public fullName: string,
        public dateOfBirth: Date,
        public gender: "male" | "female" | "other",
        public idNumber: string,
        public phoneNumber: string,
        public address: string,
        public department: string,
        public insuranceType: "bh" | "none",
        public registrationTime: Date,
        public status: "waiting" | "in-progress" | "completed",
        public priority: "normal" | "urgent",
        public doctor?: string
    ) {
    }
    // benh nhaan cap cuu ('1' === 1 => sai)
    isUrgent(): boolean {
        return this.priority === "urgent";
    }
    // neu bn kham xong
    isDone(): boolean {
        return this.status === "completed";
    }
    // kiem tra cos bao hiem ko
    hasInsurance(): boolean {
        return this.insuranceType !== "none";
    }
    // tinh tuoi
    getAge(): number {
        const today = new Date();
        const birthDate = new Date(this.dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
   // hieen thi teen va ma benh nhan
    getFullDisplayName(): string {
        return `${this.fullName} (${this.id})`;
    }

}
