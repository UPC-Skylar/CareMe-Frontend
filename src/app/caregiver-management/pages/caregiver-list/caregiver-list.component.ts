// src/app/caregiver-management/pages/caregiver-list/caregiver-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Caregiver } from '../../../shared/model/caregiver.entity';
import { CaregiverService, CaregiverFilters } from '../../services/caregiver.service';
import { FavoritesService } from '../../../favorites/services/favorites.service';

@Component({
  selector: 'app-caregiver-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './caregiver-list.component.html',
  styleUrls: ['./caregiver-list.component.css']
})
export class CaregiverListComponent implements OnInit {
  caregivers: Caregiver[] = [];
  filteredCaregivers: Caregiver[] = [];
  loading = true;
  searchTerm = '';
  favorites: string[] = [];

  // Filter options
  specialties = ['Geriatría', 'Cuidados Intensivos', 'Rehabilitación', 'Cuidados Paliativos', 'Pediatría'];
  selectedSpecialty = '';
  selectedLocation = '';
  minExperience = 0;

  constructor(
    private caregiverService: CaregiverService,
    private favoritesService: FavoritesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadCaregivers();
    this.loadFavorites();
  }

  private loadCaregivers() {
    this.loading = true;
    this.caregiverService.getAllCaregivers().subscribe({
      next: (caregivers) => {
        this.caregivers = caregivers;
        this.filteredCaregivers = caregivers;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading caregivers:', error);
        this.loading = false;
        this.showError('Error al cargar los cuidadores');
      }
    });
  }

  private loadFavorites() {
    this.favoritesService.favorites$.subscribe(favorites => {
      this.favorites = favorites;
    });
  }

  onSearch() {
    this.applyFilters();
  }

  onFilterChange() {
    this.applyFilters();
  }

  private applyFilters() {
    let filtered = [...this.caregivers];

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(caregiver =>
        caregiver.name.toLowerCase().includes(term) ||
        caregiver.specialty.toLowerCase().includes(term) ||
        caregiver.location.toLowerCase().includes(term)
      );
    }

    // Specialty filter
    if (this.selectedSpecialty) {
      filtered = filtered.filter(caregiver =>
        caregiver.specialty === this.selectedSpecialty
      );
    }

    // Location filter
    if (this.selectedLocation) {
      filtered = filtered.filter(caregiver =>
        caregiver.location.toLowerCase().includes(this.selectedLocation.toLowerCase())
      );
    }

    // Experience filter
    if (this.minExperience > 0) {
      filtered = filtered.filter(caregiver =>
        caregiver.yearsOfExperience >= this.minExperience
      );
    }

    this.filteredCaregivers = filtered;
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedSpecialty = '';
    this.selectedLocation = '';
    this.minExperience = 0;
    this.filteredCaregivers = [...this.caregivers];
  }

  isFavorite(caregiverId: string): boolean {
    return this.favorites.includes(caregiverId);
  }

  toggleFavorite(caregiver: Caregiver) {
    const isFav = this.isFavorite(caregiver.caregiverId);

    if (isFav) {
      this.favoritesService.removeFromFavorites(caregiver.caregiverId).subscribe({
        next: () => {
          this.showSuccess(`${caregiver.name} removido de favoritos`);
        },
        error: () => {
          this.showError('Error al remover de favoritos');
        }
      });
    } else {
      this.favoritesService.addToFavorites(caregiver.caregiverId).subscribe({
        next: () => {
          this.showSuccess(`${caregiver.name} agregado a favoritos`);
        },
        error: () => {
          this.showError('Error al agregar a favoritos');
        }
      });
    }
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
