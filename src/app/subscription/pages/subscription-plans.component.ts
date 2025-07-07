import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


import { SubscriptionService, SubscriptionPlan } from '../services/subscription.service';
import { Subscription } from '../../shared/model/subscription.entity';

@Component({
  selector: 'app-subscription-plans',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './subscription-plans.component.html',
  styleUrls: ['./subscription-plans.component.css']
})
export class SubscriptionPlansComponent implements OnInit {
  plans: SubscriptionPlan[] = [];
  currentSubscription: Subscription | null = null;
  loading = false;
  subscribing = false;

  constructor(
    private subscriptionService: SubscriptionService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadPlans();
    this.loadCurrentSubscription();
  }

  private loadPlans() {
    this.plans = this.subscriptionService.getAvailablePlans();
  }

  private loadCurrentSubscription() {
    this.loading = true;
    this.subscriptionService.currentSubscription$.subscribe({
      next: (subscription) => {
        this.currentSubscription = subscription;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading current subscription:', error);
        this.loading = false;
      }
    });
  }

  subscribeToPlan(plan: SubscriptionPlan) {
    if (this.subscribing) return;

    this.subscribing = true;
    this.subscriptionService.subscribeToPlan(plan.type).subscribe({
      next: (subscription) => {
        this.currentSubscription = subscription;
        this.subscribing = false;
        this.showSuccess(`Te has suscrito al plan ${plan.name} exitosamente`);
      },
      error: (error) => {
        console.error('Error subscribing to plan:', error);
        this.subscribing = false;
        this.showError('Error al procesar la suscripción');
      }
    });
  }

  upgradePlan(plan: SubscriptionPlan) {
    if (!this.currentSubscription || this.subscribing) return;

    this.subscribing = true;
    this.subscriptionService.upgradeSubscription(this.currentSubscription.id, plan.type).subscribe({
      next: (subscription) => {
        this.currentSubscription = subscription;
        this.subscribing = false;
        this.showSuccess(`Plan actualizado a ${plan.name} exitosamente`);
      },
      error: (error) => {
        console.error('Error upgrading plan:', error);
        this.subscribing = false;
        this.showError('Error al actualizar el plan');
      }
    });
  }

  cancelSubscription() {
    if (!this.currentSubscription || this.subscribing) return;

    this.subscribing = true;
    this.subscriptionService.cancelSubscription(this.currentSubscription.id).subscribe({
      next: () => {
        this.currentSubscription = null;
        this.subscribing = false;
        this.showSuccess('Suscripción cancelada exitosamente');
      },
      error: (error) => {
        console.error('Error canceling subscription:', error);
        this.subscribing = false;
        this.showError('Error al cancelar la suscripción');
      }
    });
  }

  isCurrentPlan(plan: SubscriptionPlan): boolean {
    return this.currentSubscription?.planType === plan.type;
  }

  canUpgrade(plan: SubscriptionPlan): boolean {
    if (!this.currentSubscription) return false;

    const currentPlanPrice = this.plans.find(p => p.type === this.currentSubscription!.planType)?.price || 0;
    return plan.price > currentPlanPrice;
  }

  canDowngrade(plan: SubscriptionPlan): boolean {
    if (!this.currentSubscription) return false;

    const currentPlanPrice = this.plans.find(p => p.type === this.currentSubscription!.planType)?.price || 0;
    return plan.price < currentPlanPrice;
  }

  getButtonText(plan: SubscriptionPlan): string {
    if (this.isCurrentPlan(plan)) {
      return 'Plan Actual';
    }

    if (!this.currentSubscription) {
      return 'Suscribirse';
    }

    if (this.canUpgrade(plan)) {
      return 'Actualizar';
    }

    if (this.canDowngrade(plan)) {
      return 'Cambiar';
    }

    return 'Suscribirse';
  }

  isButtonDisabled(plan: SubscriptionPlan): boolean {
    return this.subscribing || this.isCurrentPlan(plan);
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
