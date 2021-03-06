import { Location } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Resume } from '../models/resume';

@Injectable()
export class ResumeService {
  private resume: {
    lang: string;
    value: Resume;
  };

  constructor(private http: HttpClient, private location: Location) {
    this.resume = { lang: '', value: null };
  }

  getResume(lang: string): Observable<Resume | string> {
    lang = lang || 'en';

    if (this.resume && this.resume.lang === lang) {
      return of(this.resume.value);
    }

    let path = `${environment.dataPath}data.${lang}.json`;

    if (!environment.production) {
      path = this.location.prepareExternalUrl(path);
    }

    return this.http.get<Resume>(path).pipe(
      tap(resume => {
        this.resume.lang = lang;
        this.resume.value = resume;
      }),
      catchError(err => this.handleHttpError(err))
    );
  }

  private handleHttpError(error: HttpErrorResponse) {
    console.log(`Unable to get resume content. Details: ${error.statusText}`);
    return throwError('Unable to access the resume content.');
  }
}
