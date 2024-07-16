import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public users: any = [];
  public fullName: string = '';
  constructor(
    private auth: AuthService,
    private apiService: ApiService,
    private userStore: UserStoreService
  ) {}

  ngOnInit() {
    this.apiService.getAllUsers().subscribe((res) => {
      this.users = res;
    });

    this.userStore.getFullNameFromStore().subscribe((res) => {
      let fullNameFromToken = this.auth.getFullNameFromToken();
      // this is being done since at first the data would come from observable service but once the page reloads observable would be gone but the localStorage would still have the value
      this.fullName = res || fullNameFromToken;
    });
  }

  logout() {
    this.auth.logout();
  }
}
