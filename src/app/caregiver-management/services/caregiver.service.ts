// src/app/caregiver-management/services/caregiver.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BaseService } from '../../shared/services/base.service';
import { Caregiver } from '../../shared/model/caregiver.entity';

export interface CaregiverFilters {
  specialty?: string;
  location?: string;
  minExperience?: number;
  maxExperience?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CaregiverService extends BaseService {

  constructor(http: HttpClient) {
    super(http);
  }

  getAllCaregivers(): Observable<Caregiver[]> {
    return this.get<Caregiver[]>(environment.caregiverEndpoint);
  }

  getCaregiverById(id: string): Observable<Caregiver> {
    return this.get<Caregiver>(`${environment.caregiverEndpoint}/${id}`);
  }

  searchCaregivers(searchTerm: string): Observable<Caregiver[]> {
    return this.get<Caregiver[]>(`${environment.caregiverEndpoint}?q=${searchTerm}`);
  }

  filterCaregivers(filters: CaregiverFilters): Observable<Caregiver[]> {
    let endpoint = environment.caregiverEndpoint;
    const params = new URLSearchParams();

    if (filters.specialty) {
      params.append('specialty', filters.specialty);
    }
    if (filters.location) {
      params.append('location_like', filters.location);
    }
    if (filters.minExperience) {
      params.append('yearsOfExperience_gte', filters.minExperience.toString());
    }
    if (filters.maxExperience) {
      params.append('yearsOfExperience_lte', filters.maxExperience.toString());
    }

    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }

    return this.get<Caregiver[]>(endpoint);
  }
}
