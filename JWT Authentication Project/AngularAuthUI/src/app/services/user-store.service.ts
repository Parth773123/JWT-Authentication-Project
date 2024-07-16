import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserStoreService {
  private fullName$ = new BehaviorSubject<string>('');
  private role$ = new BehaviorSubject<string>('');

  constructor() {}

  getRoleFromStore() {
    return this.role$.asObservable();
  }

  setRoleFromStrore(role: string) {
    this.role$.next(role);
  }

  getFullNameFromStore() {
    return this.fullName$.asObservable();
  }

  setFullNameFromStore(fullName: string) {
    this.fullName$.next(fullName);
  }
}
