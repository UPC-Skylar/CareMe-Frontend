// src/app/dashboard/services/dashboard.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../shared/services/base.service';

export interface DashboardStats {
  totalCaregivers: number;
  favoriteCaregivers: number;
  activeContracts: number;
  totalSpent: number;
}

export interface RecentActivity {
  id: string;
  type: 'contract' | 'favorite' | 'message';
  title: string;
  description: string;
  date: string;
  caregiverName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BaseService {

  getDashboardStats(): Observable<DashboardStats> {
    // In a real app, this would make an API call
    // For now, we'll calculate from existing data
    return new Observable(observer => {
      // Mock data - replace with actual API calls
      const stats: DashboardStats = {
        totalCaregivers: 25,
        favoriteCaregivers: 3,
        activeContracts: 1,
        totalSpent: 450
      };
      observer.next(stats);
      observer.complete();
    });
  }

  getRecentActivity(): Observable<RecentActivity[]> {
    // Mock data - replace with actual API call
    return new Observable(observer => {
      const activities: RecentActivity[] = [
        {
          id: '1',
          type: 'contract',
          title: 'Servicio completado',
          description: 'Cuidado domiciliario con Ana María González',
          date: '2024-01-15',
          caregiverName: 'Ana María González'
        },
        {
          id: '2',
          type: 'favorite',
          title: 'Cuidador agregado a favoritos',
          description: 'Patricia Flores Vega agregada a tu lista',
          date: '2024-01-14',
          caregiverName: 'Patricia Flores Vega'
        },
        {
          id: '3',
          type: 'message',
          title: 'Mensaje de soporte respondido',
          description: 'Tu consulta ha sido resuelta',
          date: '2024-01-13'
        }
      ];
      observer.next(activities);
      observer.complete();
    });
  }
}
