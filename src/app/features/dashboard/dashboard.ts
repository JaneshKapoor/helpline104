import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallService } from '../../core/services/call.service';
import { AuthService } from '../../core/services/auth.service';
import { CallStats, CallRecord } from '../../core/models/call.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit {
  private readonly callService = inject(CallService);
  readonly authService = inject(AuthService);

  stats = signal<CallStats | null>(null);
  activeCalls = signal<CallRecord[]>([]);
  recentCalls = signal<CallRecord[]>([]);
  currentUser = this.authService.currentUser;

  readonly currentTime = signal(new Date());

  ngOnInit(): void {
    this.callService.getCallStats().subscribe(s => this.stats.set(s));
    this.callService.getActiveCalls().subscribe(c => this.activeCalls.set(c));
    this.callService.getRecentCalls().subscribe(c => this.recentCalls.set(c));
    setInterval(() => this.currentTime.set(new Date()), 1000);
  }

  formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }

  getStatusColor(status: string): string {
    const map: Record<string, string> = {
      Active: 'bg-green-100 text-green-700',
      Completed: 'bg-blue-100 text-blue-700',
      Missed: 'bg-red-100 text-red-700',
      'On Hold': 'bg-yellow-100 text-yellow-700',
    };
    return map[status] ?? 'bg-gray-100 text-gray-700';
  }

  getCallTypeColor(type: string): string {
    return type === 'Inbound' ? 'text-blue-600' : 'text-purple-600';
  }
}
