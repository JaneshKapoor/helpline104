export interface CallRecord {
  callId: string;
  beneficiaryName: string;
  phoneNumber: string;
  callType: 'Inbound' | 'Outbound';
  callStatus: 'Active' | 'Completed' | 'Missed' | 'On Hold';
  district: string;
  duration: number;
  timestamp: Date;
  category: string;
}

export interface CallStats {
  totalCalls: number;
  activeCalls: number;
  completedToday: number;
  avgHandleTime: number;
  satisfactionRate: number;
}

export interface Beneficiary {
  beneficiaryId: number;
  beneficiaryName: string;
  phoneNumber: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  district: string;
  state: string;
  registrationDate: Date;
  lastCallDate?: Date;
}
