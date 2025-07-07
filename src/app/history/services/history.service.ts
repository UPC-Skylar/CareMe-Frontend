// src/app/history/services/history.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { BaseService } from '../../shared/services/base.service';
import { History } from '../../shared/model/history.entity';
import { Caregiver } from '../../shared/model/caregiver.entity';

export interface HistoryWithCaregiver extends History {
  caregiverName: string;
  caregiverImage?: string;
}

export interface HistoryFilters {
  status?: 'completed' | 'cancelled' | 'pending' | '';
  dateFrom?: string;
  dateTo?: string;
  caregiverId?: string;
}

export interface HistoryStats {
  totalContracts: number;
  completedContracts: number;
  totalSpent: number;
  averageRating: number;
}

@Injectable({
  providedIn: 'root'
})
export class HistoryService extends BaseService {

  constructor(http: HttpClient) {
    super(http);
  }

  getUserHistory(): Observable<History[]> {
    const userId = '1'; // Mock user ID
    return this.get<History[]>(`/history?userId=${userId}&_sort=date&_order=desc`);
  }

  getHistoryWithCaregiverDetails(): Observable<HistoryWithCaregiver[]> {
    const userId = '1'; // Mock user ID

    // Get history and caregivers data
    return forkJoin({
      history: this.get<History[]>(`/history?userId=${userId}&_sort=date&_order=desc`),
      caregivers: this.get<Caregiver[]>('/caregivers')
    }).pipe(
      map(({ history, caregivers }) => {
        // Create a map for quick caregiver lookup
        const caregiverMap = new Map<string, Caregiver>();
        caregivers.forEach(caregiver => {
          caregiverMap.set(caregiver.caregiverId, caregiver);
        });

        // Map history items with caregiver details
        return history.map(item => {
          const caregiver = caregiverMap.get(item.caregiverId);
          return {
            ...item,
            caregiverName: caregiver?.name || 'Cuidador no encontrado',
            caregiverImage: caregiver?.profileImage || 'https://via.placeholder.com/150'
          };
        });
      })
    );
  }

  private getCaregiverNameById(caregiverId: string): string {
    // Mock caregiver names mapping (fallback)
    const caregiverNames: { [key: string]: string } = {
      'cg-001': 'Ana María González',
      'cg-002': 'Carlos Roberto Mendoza',
      'cg-003': 'Patricia Flores Vega',
      'cg-004': 'Luis Fernando Torres',
      'cg-005': 'Rosa Elena Huamán'
    };

    return caregiverNames[caregiverId] || 'Cuidador no encontrado';
  }

  private getCaregiverImageById(caregiverId: string): string {
    // Mock caregiver images mapping (fallback)
    const caregiverImages: { [key: string]: string } = {
      'cg-001': 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
      'cg-002': 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
      'cg-003': 'https://images.unsplash.com/photo-1551601651-05fa5ac6f69e?w=150&h=150&fit=crop&crop=face',
      'cg-004': 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
      'cg-005': 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=150&h=150&fit=crop&crop=face'
    };

    return caregiverImages[caregiverId] || 'https://via.placeholder.com/150';
  }

  filterHistory(filters: HistoryFilters): Observable<HistoryWithCaregiver[]> {
    let endpoint = `/history?userId=1&_sort=date&_order=desc`;

    if (filters.status) {
      endpoint += `&status=${filters.status}`;
    }

    if (filters.caregiverId) {
      endpoint += `&caregiverId=${filters.caregiverId}`;
    }

    if (filters.dateFrom) {
      endpoint += `&date_gte=${filters.dateFrom}`;
    }

    if (filters.dateTo) {
      endpoint += `&date_lte=${filters.dateTo}`;
    }

    return forkJoin({
      history: this.get<History[]>(endpoint),
      caregivers: this.get<Caregiver[]>('/caregivers')
    }).pipe(
      map(({ history, caregivers }) => {
        // Create a map for quick caregiver lookup
        const caregiverMap = new Map<string, Caregiver>();
        caregivers.forEach(caregiver => {
          caregiverMap.set(caregiver.caregiverId, caregiver);
        });

        // Map history items with caregiver details
        return history.map(item => {
          const caregiver = caregiverMap.get(item.caregiverId);
          return {
            ...item,
            caregiverName: caregiver?.name || this.getCaregiverNameById(item.caregiverId),
            caregiverImage: caregiver?.profileImage || this.getCaregiverImageById(item.caregiverId)
          };
        });
      })
    );
  }

  getHistoryById(id: string): Observable<HistoryWithCaregiver> {
    return forkJoin({
      history: this.get<History>(`/history/${id}`),
      caregivers: this.get<Caregiver[]>('/caregivers')
    }).pipe(
      map(({ history, caregivers }) => {
        const caregiver = caregivers.find(c => c.caregiverId === history.caregiverId);
        return {
          ...history,
          caregiverName: caregiver?.name || this.getCaregiverNameById(history.caregiverId),
          caregiverImage: caregiver?.profileImage || this.getCaregiverImageById(history.caregiverId)
        };
      })
    );
  }

  getHistoryStats(): Observable<HistoryStats> {
    const userId = '1'; // Mock user ID

    return this.get<History[]>(`/history?userId=${userId}`)
      .pipe(
        map((history: History[]) => {
          const totalContracts = history.length;
          const completedContracts = history.filter(h => h.status === 'completed').length;
          const totalSpent = history.reduce((sum, h) => sum + h.amount, 0);
          const averageRating = 4.7; // Mock average rating

          return {
            totalContracts,
            completedContracts,
            totalSpent,
            averageRating
          };
        })
      );
  }
}
