import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class ActivePageService {
  private pages: string[] = ['about', 'skills', 'experience', 'education'];
  private currentPage: string = this.pages[0];

  constructor(private router: Router) {}

  next(): void {
    let pageIndex = this.pages.indexOf(this.currentPage);
    pageIndex = (pageIndex + 1) % this.pages.length;

    this.currentPage = this.pages[pageIndex];

    this.router.navigate([`/${this.currentPage}`]);
  }

  previous(): void {
    let pageIndex = this.pages.indexOf(this.currentPage) - 1;

    if (pageIndex < 0) {
      pageIndex = this.pages.length - 1;
    }

    this.currentPage = this.pages[pageIndex];

    this.router.navigate([`/${this.currentPage}`]);
  }
}
