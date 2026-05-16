import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CallRecord, CallStats, Beneficiary } from '../models/call.model';

@Injectable({ providedIn: 'root' })
export class CallService {
  private readonly http = inject(HttpClient);

  getCallStats(): Observable<CallStats> {
    return of({
      totalCalls: 1248,
      activeCalls: 7,
      completedToday: 312,
      avgHandleTime: 4.2,
      satisfactionRate: 94.3,
    });
  }

  getActiveCalls(): Observable<CallRecord[]> {
    return of([
      { callId: 'C001', beneficiaryName: 'Priya Sharma', phoneNumber: '9876543210', callType: 'Inbound', callStatus: 'Active', district: 'Hyderabad', duration: 180, timestamp: new Date(), category: 'Medical Advice' },
      { callId: 'C002', beneficiaryName: 'Rajesh Kumar', phoneNumber: '9123456780', callType: 'Inbound', callStatus: 'On Hold', district: 'Vijayawada', duration: 95, timestamp: new Date(), category: 'Emergency' },
      { callId: 'C003', beneficiaryName: 'Ananya Reddy', phoneNumber: '9012345678', callType: 'Outbound', callStatus: 'Active', district: 'Visakhapatnam', duration: 240, timestamp: new Date(), category: 'Follow-up' },
      { callId: 'C004', beneficiaryName: 'Mohan Das', phoneNumber: '8765432109', callType: 'Inbound', callStatus: 'Active', district: 'Guntur', duration: 60, timestamp: new Date(), category: 'Mental Health' },
      { callId: 'C005', beneficiaryName: 'Sunita Patel', phoneNumber: '8901234567', callType: 'Inbound', callStatus: 'Active', district: 'Kurnool', duration: 150, timestamp: new Date(), category: 'Chronic Disease' },
    ]);
  }

  getRecentCalls(): Observable<CallRecord[]> {
    return of([
      { callId: 'C100', beneficiaryName: 'Lakshmi Devi', phoneNumber: '9988776655', callType: 'Inbound', callStatus: 'Completed', district: 'Nellore', duration: 320, timestamp: new Date(Date.now() - 600000), category: 'General Health' },
      { callId: 'C101', beneficiaryName: 'Venkat Rao', phoneNumber: '9876001234', callType: 'Outbound', callStatus: 'Completed', district: 'Tirupati', duration: 180, timestamp: new Date(Date.now() - 1200000), category: 'Mental Health' },
      { callId: 'C102', beneficiaryName: 'Fatima Begum', phoneNumber: '8833445566', callType: 'Inbound', callStatus: 'Missed', district: 'Kadapa', duration: 0, timestamp: new Date(Date.now() - 1800000), category: 'Emergency' },
      { callId: 'C103', beneficiaryName: 'Suresh Babu', phoneNumber: '9900112233', callType: 'Inbound', callStatus: 'Completed', district: 'Anantapur', duration: 410, timestamp: new Date(Date.now() - 2400000), category: 'Medical Advice' },
    ]);
  }

  getBeneficiaries(): Observable<Beneficiary[]> {
    return of([
      { beneficiaryId: 1, beneficiaryName: 'Priya Sharma', phoneNumber: '9876543210', gender: 'Female', age: 34, district: 'Hyderabad', state: 'Andhra Pradesh', registrationDate: new Date('2024-01-15'), lastCallDate: new Date() },
      { beneficiaryId: 2, beneficiaryName: 'Rajesh Kumar', phoneNumber: '9123456780', gender: 'Male', age: 52, district: 'Vijayawada', state: 'Andhra Pradesh', registrationDate: new Date('2024-02-20') },
      { beneficiaryId: 3, beneficiaryName: 'Ananya Reddy', phoneNumber: '9012345678', gender: 'Female', age: 28, district: 'Visakhapatnam', state: 'Andhra Pradesh', registrationDate: new Date('2024-03-10'), lastCallDate: new Date() },
    ]);
  }
}
