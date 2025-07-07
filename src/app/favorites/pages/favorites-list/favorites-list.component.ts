import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { FavoritesService } from '../../services/favorites.service';
import { CaregiverService } from '../../../caregiver-management/services/caregiver.service';
import { Caregiver } from '../../../shared/model/caregiver.entity';

@Component({
  selector: 'app-favorites-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './favorites-list.component.html',
  styleUrls: ['./favorites-list.component.css']
})
export class FavoritesListComponent implements OnInit {
  favoriteCaregivers: Caregiver[] = [];
  favoriteIds: string[] = [];
  loading = true;

  constructor(
    private favoritesService: FavoritesService,
    private caregiverService: CaregiverService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadFavorites();
  }

  private loadFavorites() {
    this.loading = true;

    // First get the favorite caregiver IDs
    this.favoritesService.favorites$.subscribe({
      next: (favoriteIds) => {
        this.favoriteIds = favoriteIds;
        this.loadFavoriteCaregiversDetails();
      },
      error: (error) => {
        console.error('Error loading favorites:', error);
        this.loading = false;
        this.showError('Error al cargar los favoritos');
      }
    });
  }

  private loadFavoriteCaregiversDetails() {
    if (this.favoriteIds.length === 0) {
      this.favoriteCaregivers = [];
      this.loading = false;
      return;
    }

    // Get all caregivers and filter favorites
    this.caregiverService.getAllCaregivers().subscribe({
      next: (allCaregivers) => {
        this.favoriteCaregivers = allCaregivers.filter(caregiver =>
          this.favoriteIds.includes(caregiver.caregiverId)
        );
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading caregiver details:', error);
        this.loading = false;
        this.showError('Error al cargar los detalles de los cuidadores');
      }
    });
  }

  removeFromFavorites(caregiver: Caregiver) {
    this.favoritesService.removeFromFavorites(caregiver.caregiverId).subscribe({
      next: () => {
        this.showSuccess(`${caregiver.name} removido de favoritos`);
        // The list will update automatically through the favorites$ subscription
      },
      error: (error) => {
        console.error('Error removing from favorites:', error);
        this.showError('Error al remover de favoritos');
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
