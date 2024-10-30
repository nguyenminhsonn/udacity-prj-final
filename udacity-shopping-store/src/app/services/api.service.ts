import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private readonly httpClient: HttpClient) {}

  fetchData<T>(url: string, config?: any): Observable<T> {
    return this.httpClient.get<T>(url, config) as Observable<T>;
  }
}
