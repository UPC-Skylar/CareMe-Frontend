import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  translationKey: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: MenuItem[] = [
    {
      icon: 'dashboard',
      label: 'Dashboard',
      route: '/dashboard',
      translationKey: 'nav.dashboard'
    },
    {
      icon: 'people',
      label: 'Caregivers',
      route: '/caregivers',
      translationKey: 'nav.caregivers'
    },
    {
      icon: 'person',
      label: 'My Profile',
      route: '/profile',
      translationKey: 'nav.profile'
    },
    {
      icon: 'history',
      label: 'History',
      route: '/history',
      translationKey: 'nav.history'
    },
    {
      icon: 'favorite',
      label: 'Favorites',
      route: '/favorites',
      translationKey: 'nav.favorites'
    },
    {
      icon: 'card_membership',
      label: 'Subscription',
      route: '/subscription',
      translationKey: 'nav.subscription'
    },
    {
      icon: 'support',
      label: 'Support',
      route: '/support',
      translationKey: 'nav.support'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {}

  isActiveRoute(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
