import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { BaseService } from '../../shared/services/base.service';
import { Favorite } from '../../shared/model/favorite.entity';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService extends BaseService {
  private favoritesSubject = new BehaviorSubject<string[]>([]);
  public favorites$ = this.favoritesSubject.asObservable();

  constructor(http: HttpClient) {
    super(http);
    this.loadFavorites();
  }

  private loadFavorites() {
    // In a real app, get current user ID from auth service
    const userId = '1'; // Mock user ID

    this.get<Favorite[]>(`/favorites?userId=${userId}`)
      .pipe(
        map((favorites: Favorite[]) => favorites.map(fav => fav.caregiverId))
      )
      .subscribe((caregiverIds: string[]) => {
        this.favoritesSubject.next(caregiverIds);
      });
  }

  getFavoriteCaregiversDetails(): Observable<string[]> {
    const userId = '1'; // Mock user ID

    return this.get<Favorite[]>(`/favorites?userId=${userId}`)
      .pipe(
        map((favorites: Favorite[]) => favorites.map(fav => fav.caregiverId))
      );
  }

  addToFavorites(caregiverId: string): Observable<Favorite> {
    const userId = '1'; // Mock user ID
    const favorite: Omit<Favorite, 'id'> = {
      userId,
      caregiverId,
      addedDate: new Date().toISOString().split('T')[0]
    };

    return this.post<Favorite>('/favorites', favorite)
      .pipe(
        tap(() => {
          const currentFavorites = this.favoritesSubject.value;
          this.favoritesSubject.next([...currentFavorites, caregiverId]);
        })
      );
  }

  removeFromFavorites(caregiverId: string): Observable<void> {
    const userId = '1'; // Mock user ID

    return this.get<Favorite[]>(`/favorites?userId=${userId}&caregiverId=${caregiverId}`)
      .pipe(
        map((favorites: Favorite[]) => favorites[0]),
        tap((favorite: Favorite) => {
          if (favorite) {
            this.delete(`/favorites/${favorite.id}`).subscribe();
            const currentFavorites = this.favoritesSubject.value;
            this.favoritesSubject.next(currentFavorites.filter(id => id !== caregiverId));
          }
        }),
        map(() => void 0)
      );
  }

  isFavorite(caregiverId: string): Observable<boolean> {
    return this.favorites$.pipe(
      map((favorites: string[]) => favorites.includes(caregiverId))
    );
  }

  getFavoritesCount(): Observable<number> {
    return this.favorites$.pipe(
      map((favorites: string[]) => favorites.length)
    );
  }
}
