// src/app/history/pages/history-list/history-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { HistoryService, HistoryWithCaregiver, HistoryFilters } from '../../services/history.service';

@Component({
  selector: 'app-history-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTooltipModule
  ],
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.css']
})
export class HistoryListComponent implements OnInit {
  historyItems: HistoryWithCaregiver[] = [];
  filteredHistory: HistoryWithCaregiver[] = [];
  loading = true;

  // Filters
  selectedStatus = '';
  dateFrom: Date | null = null;
  dateTo: Date | null = null;

  // Stats
  stats = {
    totalContracts: 0,
    completedContracts: 0,
    totalSpent: 0,
    averageRating: 0
  };

  // Table columns
  displayedColumns: string[] = ['caregiver', 'date', 'duration', 'status', 'amount', 'actions'];

  statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'completed', label: 'Completado' },
    { value: 'cancelled', label: 'Cancelado' },
    { value: 'pending', label: 'Pendiente' }
  ];

  constructor(private historyService: HistoryService) {}

  ngOnInit() {
    this.loadHistory();
    this.loadStats();
  }

  private loadHistory() {
    this.loading = true;
    this.historyService.getHistoryWithCaregiverDetails().subscribe({
      next: (history: HistoryWithCaregiver[]) => {
        this.historyItems = history;
        this.filteredHistory = history;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading history:', error);
        this.loading = false;
      }
    });
  }

  private loadStats() {
    this.historyService.getHistoryStats().subscribe({
      next: (stats: any) => {
        this.stats = stats;
      },
      error: (error: any) => {
        console.error('Error loading stats:', error);
      }
    });
  }

  applyFilters() {
    const filters: HistoryFilters = {
      status: this.selectedStatus as any,
      dateFrom: this.dateFrom ? this.formatDate(this.dateFrom) : undefined,
      dateTo: this.dateTo ? this.formatDate(this.dateTo) : undefined
    };

    // Filter locally for now (in a real app, this would be done server-side)
    let filtered = [...this.historyItems];

    if (filters.status) {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(item => item.date >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      filtered = filtered.filter(item => item.date <= filters.dateTo!);
    }

    this.filteredHistory = filtered;
  }

  clearFilters() {
    this.selectedStatus = '';
    this.dateFrom = null;
    this.dateTo = null;
    this.filteredHistory = [...this.historyItems];
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'success';
      case 'cancelled': return 'warn';
      case 'pending': return 'accent';
      default: return 'primary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'completed': return 'Completado';
      case 'cancelled': return 'Cancelado';
      case 'pending': return 'Pendiente';
      default: return status;
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'completed': return 'check_circle';
      case 'cancelled': return 'cancel';
      case 'pending': return 'schedule';
      default: return 'help';
    }
  }

  viewDetails(item: HistoryWithCaregiver) {
    // Navigate to detail view or open modal
    console.log('View details for:', item);
  }

  downloadInvoice(item: HistoryWithCaregiver) {
    // Download invoice functionality
    console.log('Download invoice for:', item);
  }
}
