// src/app/shared/components/header/header.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    MatDividerModule,
    MatOptionModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentLanguage: string = 'en';

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    this.currentLanguage = this.translate.currentLang || 'en';
  }

  changeLanguage(language: string) {
    this.currentLanguage = language;
    this.translate.use(language);
    localStorage.setItem('language', language);
  }

  logout() {
    // Implement logout logic
    console.log('Logout functionality to be implemented');
  }
}
