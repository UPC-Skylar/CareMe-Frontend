// src/app/caregiver-management/pages/caregiver-detail/caregiver-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Caregiver } from '../../../shared/model/caregiver.entity';
import { CaregiverService } from '../../services/caregiver.service';

@Component({
  selector: 'app-caregiver-detail',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './caregiver-detail.component.html',
  styleUrls: ['./caregiver-detail.component.css']
})
export class CaregiverDetailComponent implements OnInit {
  caregiver: Caregiver | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private caregiverService: CaregiverService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCaregiver(id);
    }
  }

  private loadCaregiver(id: string) {
    this.loading = true;
    this.caregiverService.getCaregiverById(id).subscribe({
      next: (caregiver: Caregiver) => {
        this.caregiver = caregiver;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading caregiver:', error);
        this.loading = false;
      }
    });
  }

  getRatingStars(rating: number): string[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push('star');
    }

    if (hasHalfStar) {
      stars.push('star_half');
    }

    while (stars.length < 5) {
      stars.push('star_border');
    }

    return stars;
  }
}
