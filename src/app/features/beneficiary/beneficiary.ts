import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CallService } from '../../core/services/call.service';
import { Beneficiary } from '../../core/models/call.model';

@Component({
  selector: 'app-beneficiary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './beneficiary.html',
})
export class BeneficiaryComponent implements OnInit {
  private readonly callService = inject(CallService);
  beneficiaries = signal<Beneficiary[]>([]);
  search = '';

  ngOnInit(): void {
    this.callService.getBeneficiaries().subscribe(b => this.beneficiaries.set(b));
  }

  get filtered(): Beneficiary[] {
    if (!this.search.trim()) return this.beneficiaries();
    const q = this.search.toLowerCase();
    return this.beneficiaries().filter(b =>
      b.beneficiaryName.toLowerCase().includes(q) ||
      b.phoneNumber.includes(q) ||
      b.district.toLowerCase().includes(q)
    );
  }
}
