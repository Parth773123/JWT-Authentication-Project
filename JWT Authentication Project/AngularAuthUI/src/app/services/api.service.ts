import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService implements OnInit {
  baseUrl: string = 'https://localhost:44373/api/User/getAllUsers';

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  getAllUsers() {
    return this.http.get<any[]>(this.baseUrl);
  }
}
