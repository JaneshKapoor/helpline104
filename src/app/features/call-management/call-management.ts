import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CallService } from '../../core/services/call.service';
import { CallRecord } from '../../core/models/call.model';

@Component({
  selector: 'app-call-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './call-management.html',
})
export class CallManagementComponent implements OnInit {
  private readonly callService = inject(CallService);
  calls = signal<CallRecord[]>([]);
  search = '';

  ngOnInit(): void {
    this.callService.getActiveCalls().subscribe(c => this.calls.set(c));
  }

  get filtered(): CallRecord[] {
    if (!this.search.trim()) return this.calls();
    const q = this.search.toLowerCase();
    return this.calls().filter(c =>
      c.beneficiaryName.toLowerCase().includes(q) ||
      c.phoneNumber.includes(q) ||
      c.district.toLowerCase().includes(q)
    );
  }

  getStatusColor(status: string): string {
    const map: Record<string, string> = {
      Active: 'bg-green-100 text-green-700 border-green-200',
      Completed: 'bg-blue-100 text-blue-700 border-blue-200',
      Missed: 'bg-red-100 text-red-700 border-red-200',
      'On Hold': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    };
    return map[status] ?? 'bg-gray-100 text-gray-700';
  }

  formatDuration(sec: number): string {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  }
}
