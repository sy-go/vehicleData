export interface VehicleDetails {
    make: string;
    colour: string;
    yearOfManufacture: number;
    monthOfFirstRegistration: string;
    motStatus: string;
    motExpiryDate: string;
    taxStatus: string;
    taxDueDate: string;
    engineCapacity: number;
    fuelType: string;
    co2Emissions: number;
    dateOfLastV5CIssued: string;
    typeApproval: string;
    wheelplan: string;
    markedForExport: boolean;
  }
  
  export interface MotHistory {
    model: string;
  }
  
  export interface Defect {
    type: string;
    text: string;
  }
  
  export interface MotTest {
    completedDate: string;
    testResult: string;
    odometerValue: number;
    defects?: Defect[];
  }

  