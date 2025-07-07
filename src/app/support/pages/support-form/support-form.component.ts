import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';

import { SupportService, CreateSupportRequest, FAQItem, SupportTicket } from '../../services/support.service';
import { ProfileService } from '../../../profile/services/profile.service';
import {MatChip} from '@angular/material/chips';

@Component({
  selector: 'app-support-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTabsModule,
    MatChip
  ],
  templateUrl: './support-form.component.html',
  styleUrls: ['./support-form.component.css']
})
export class SupportFormComponent implements OnInit {
  supportForm: FormGroup;
  faqItems: FAQItem[] = [];
  userTickets: SupportTicket[] = [];
  loading = false;
  submitting = false;
  loadingFAQ = true;
  loadingTickets = true;

  subjectOptions = [
    'Problema técnico',
    'Consulta sobre cuidadores',
    'Facturación y pagos',
    'Suscripciones',
    'Emergencia',
    'Sugerencia',
    'Otro'
  ];

  constructor(
    private fb: FormBuilder,
    private supportService: SupportService,
    private profileService: ProfileService,
    private snackBar: MatSnackBar
  ) {
    this.supportForm = this.createSupportForm();
  }

  ngOnInit() {
    this.loadUserData();
    this.loadFAQ();
    this.loadUserTickets();
  }

  private createSupportForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  private loadUserData() {
    this.profileService.user$.subscribe(user => {
      if (user) {
        this.supportForm.patchValue({
          name: user.firstname,
          email: user.email
        });
      }
    });
  }

  private loadFAQ() {
    this.loadingFAQ = true;
    this.supportService.getFAQItems().subscribe({
      next: (faqItems) => {
        this.faqItems = faqItems;
        this.loadingFAQ = false;
      },
      error: (error) => {
        console.error('Error loading FAQ:', error);
        this.loadingFAQ = false;
      }
    });
  }

  private loadUserTickets() {
    this.loadingTickets = true;
    this.supportService.getUserSupportTickets().subscribe({
      next: (tickets) => {
        this.userTickets = tickets;
        this.loadingTickets = false;
      },
      error: (error) => {
        console.error('Error loading tickets:', error);
        this.loadingTickets = false;
      }
    });
  }

  onSubmit() {
    if (this.supportForm.invalid || this.submitting) {
      return;
    }

    const formValue = this.supportForm.value;
    const request: CreateSupportRequest = {
      name: formValue.name,
      email: formValue.email,
      subject: formValue.subject,
      message: formValue.message
    };

    this.submitting = true;
    this.supportService.createSupportTicket(request).subscribe({
      next: (ticket) => {
        this.submitting = false;
        this.supportForm.reset();
        this.loadUserData(); // Reload user data
        this.loadUserTickets(); // Refresh tickets list
        this.showSuccess('Mensaje enviado exitosamente. Te contactaremos pronto.');
      },
      error: (error) => {
        console.error('Error sending support message:', error);
        this.submitting = false;
        this.showError('Error al enviar el mensaje. Inténtalo nuevamente.');
      }
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.supportForm.get(fieldName);

    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }

    if (field?.hasError('email')) {
      return 'Ingrese un email válido';
    }

    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength']?.requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }

    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.supportForm.get(fieldName);
    return !!(field?.invalid && (field?.dirty || field?.touched));
  }

  getFAQByCategory(category: string): FAQItem[] {
    return this.faqItems.filter(item => item.category === category);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'resolved': return 'success';
      case 'pending': return 'warn';
      case 'in-progress': return 'accent';
      default: return 'primary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'resolved': return 'Resuelto';
      case 'pending': return 'Pendiente';
      case 'in-progress': return 'En Progreso';
      default: return status;
    }
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['success-snack']
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snack']
    });
  }
}
