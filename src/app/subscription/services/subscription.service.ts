// src/app/subscription/services/subscription.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from '../../shared/services/base.service';
import { Subscription as UserSubscription } from '../../shared/model/subscription.entity';

export interface SubscriptionPlan {
  id: string;
  name: string;
  type: 'premium' | 'promax';
  price: number;
  currency: string;
  features: string[];
  recommended?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService extends BaseService {
  private currentSubscriptionSubject = new BehaviorSubject<UserSubscription | null>(null);
  public currentSubscription$ = this.currentSubscriptionSubject.asObservable();

  constructor(http: HttpClient) {
    super(http);
    this.loadCurrentSubscription();
  }

  getAvailablePlans(): SubscriptionPlan[] {
    return [
      {
        id: 'premium',
        name: 'Premium',
        type: 'premium',
        price: 20,
        currency: 'PEN',
        features: [
          'Acceso a cuidadores verificados',
          'Soporte básico',
          'Seguimiento de ubicación',
          'Botón de emergencia básico'
        ]
      },
      {
        id: 'promax',
        name: 'Pro Max',
        type: 'promax',
        price: 35,
        currency: 'PEN',
        recommended: true,
        features: [
          'Acceso a todos los cuidadores premium',
          'Soporte prioritario 24/7',
          'Seguimiento avanzado de ubicación',
          'Botón de emergencia con respuesta instantánea',
          'Notificaciones familiares',
          'Reportes detallados'
        ]
      }
    ];
  }

  getCurrentSubscription(): Observable<UserSubscription[]> {
    const userId = '1'; // Mock user ID
    return this.get<UserSubscription[]>(`/subscriptions?userId=${userId}&status=active`);
  }

  private loadCurrentSubscription(): void {
    this.getCurrentSubscription().subscribe({
      next: (subscriptions: UserSubscription[]) => {
        const activeSubscription = subscriptions.find(sub => sub.status === 'active');
        this.currentSubscriptionSubject.next(activeSubscription || null);
      },
      error: (error: any) => {
        console.error('Error loading current subscription:', error);
        this.currentSubscriptionSubject.next(null);
      }
    });
  }

  subscribeToPlan(planType: 'premium' | 'promax'): Observable<UserSubscription> {
    const userId = '1'; // Mock user ID
    const plan = this.getAvailablePlans().find(p => p.type === planType);

    if (!plan) {
      throw new Error('Plan not found');
    }

    const subscription: Omit<UserSubscription, 'id'> = {
      userId,
      planType,
      price: plan.price,
      currency: plan.currency,
      startDate: new Date().toISOString().split('T')[0],
      endDate: this.calculateEndDate(new Date(), 1), // 1 month
      status: 'active'
    };

    return this.post<UserSubscription>('/subscriptions', subscription).pipe(
      map((newSubscription: UserSubscription) => {
        this.currentSubscriptionSubject.next(newSubscription);
        return newSubscription;
      })
    );
  }

  cancelSubscription(subscriptionId: string): Observable<UserSubscription> {
    return this.put<UserSubscription>(`/subscriptions/${subscriptionId}`, {
      status: 'inactive'
    }).pipe(
      map((updatedSubscription: UserSubscription) => {
        this.currentSubscriptionSubject.next(null);
        return updatedSubscription;
      })
    );
  }

  upgradeSubscription(currentSubscriptionId: string, newPlanType: 'premium' | 'promax'): Observable<UserSubscription> {
    const plan = this.getAvailablePlans().find(p => p.type === newPlanType);

    if (!plan) {
      throw new Error('Plan not found');
    }

    return this.put<UserSubscription>(`/subscriptions/${currentSubscriptionId}`, {
      planType: newPlanType,
      price: plan.price
    }).pipe(
      map((updatedSubscription: UserSubscription) => {
        this.currentSubscriptionSubject.next(updatedSubscription);
        return updatedSubscription;
      })
    );
  }

  private calculateEndDate(startDate: Date, months: number): string {
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + months);
    return endDate.toISOString().split('T')[0];
  }

  isSubscriptionActive(): Observable<boolean> {
    return this.currentSubscription$.pipe(
      map((subscription: UserSubscription | null) =>
        subscription !== null && subscription.status === 'active'
      )
    );
  }

  getCurrentPlanType(): Observable<'premium' | 'promax' | null> {
    return this.currentSubscription$.pipe(
      map((subscription: UserSubscription | null) =>
        subscription ? subscription.planType : null
      )
    );
  }
}
