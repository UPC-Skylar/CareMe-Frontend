// src/app/profile/services/profile.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseService } from '../../shared/services/base.service';
import { User } from '../../shared/model/user.entity';

export interface UpdateProfileRequest {
  firstname: string;
  email: string;
  phone: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends BaseService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(http: HttpClient) {
    super(http);
    this.loadUserProfile();
  }

  private loadUserProfile() {
    // In a real app, get current user ID from auth service
    const userId = '1'; // Mock user ID

    this.getUserById(userId).subscribe({
      next: (user: User) => {
        this.userSubject.next(user);
      },
      error: (error: any) => {
        console.error('Error loading user profile:', error);
      }
    });
  }

  getUserById(id: string): Observable<User> {
    return this.get<User>(`/users/${id}`);
  }

  updateProfile(profileData: UpdateProfileRequest): Observable<User> {
    const userId = '1'; // Mock user ID

    return this.put<User>(`/users/${userId}`, profileData)
      .pipe(
        tap((updatedUser: User) => {
          this.userSubject.next(updatedUser);
        })
      );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    const userId = '1'; // Mock user ID

    return this.put(`/users/${userId}/password`, {
      currentPassword,
      newPassword
    });
  }

  uploadProfileImage(file: File): Observable<string> {
    // In a real app, this would upload to a file service
    // For now, we'll simulate a successful upload
    return new Observable(observer => {
      setTimeout(() => {
        const mockImageUrl = 'https://via.placeholder.com/150';
        observer.next(mockImageUrl);
        observer.complete();
      }, 1000);
    });
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  refreshUserProfile(): void {
    this.loadUserProfile();
  }
}
