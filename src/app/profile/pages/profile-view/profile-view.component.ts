// src/app/profile/pages/profile-view/profile-view.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { ProfileService, UpdateProfileRequest } from '../../services/profile.service';
import { User } from '../../../shared/model/user.entity';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {
  user: User | null = null;
  profileForm: FormGroup;
  isEditing = false;
  loading = false;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.createProfileForm();
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  private createProfileForm(): FormGroup {
    return this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+51\d{9}$/)]],
      role: [{ value: '', disabled: true }]
    });
  }

  private loadUserProfile() {
    this.loading = true;
    this.profileService.user$.subscribe({
      next: (user) => {
        if (user) {
          this.user = user;
          this.updateFormWithUserData(user);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.loading = false;
        this.showError('Error al cargar el perfil');
      }
    });
  }

  private updateFormWithUserData(user: User) {
    this.profileForm.patchValue({
      firstname: user.firstname,
      email: user.email,
      phone: user.phone,
      role: user.role
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;

    if (!this.isEditing && this.user) {
      // Cancel editing - restore original values
      this.updateFormWithUserData(this.user);
    }
  }

  onSubmit() {
    if (this.profileForm.invalid || this.saving) {
      return;
    }

    const formValue = this.profileForm.value;
    const updateData: UpdateProfileRequest = {
      firstname: formValue.firstname,
      email: formValue.email,
      phone: formValue.phone
    };

    this.saving = true;
    this.profileService.updateProfile(updateData).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.isEditing = false;
        this.saving = false;
        this.showSuccess('Perfil actualizado exitosamente');
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.saving = false;
        this.showError('Error al actualizar el perfil');
      }
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.profileForm.get(fieldName);

    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }

    if (field?.hasError('email')) {
      return 'Ingrese un email válido';
    }

    if (field?.hasError('minlength')) {
      return 'Mínimo 2 caracteres';
    }

    if (field?.hasError('pattern') && fieldName === 'phone') {
      return 'Formato: +51XXXXXXXXX';
    }

    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return !!(field?.invalid && (field?.dirty || field?.touched));
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snack']
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['error-snack']
    });
  }
}
