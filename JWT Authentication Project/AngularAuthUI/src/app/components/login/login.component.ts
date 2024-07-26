import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import ValidateForm from 'src/app/helpers/validateform';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: ToastrService,
    private userStore: UserStoreService
  ) {}

  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa fa-eye-slash';
  loginForm!: FormGroup;
  public resetPasswordEmail!: string;
  public isValidEmail!: boolean;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText
      ? (this.eyeIcon = 'fa fa-eye')
      : (this.eyeIcon = 'fa fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }

  onLogin() {
    if (this.loginForm.valid) {
      let username = this.loginForm.get('username')?.value;
      let password = this.loginForm.get('password')?.value;

      console.log('Login Successful');
      console.log(`UserName: ${username}`);
      console.log(`Password: ${password}`);

      this.auth.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.toast.success(res.message, 'SUCCESS', {
            timeOut: 3000,
          });
          this.loginForm.reset();
          this.auth.storeToken(res.accessToken);
          this.auth.storeRefreshToken(res.refreshToken);
          const tokenPayload = this.auth.decodedToken();
          this.userStore.setFullNameFromStore(tokenPayload.unique_name);
          this.userStore.setRoleFromStore(tokenPayload.role);
          this.router.navigate(['dashboard']);
        },
        error: (err) => {
          this.toast.error(err.error.message, 'ERROR', {
            timeOut: 3000,
          });
        },
      });
    } else {
      ValidateForm.validateAllFormFields(this.loginForm);
      alert('Form in not valid');
    }
  }

  checkValidEmail(event: string) {
    const value = event;
    const pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/i;

    this.isValidEmail = pattern.test(value);

    return this.isValidEmail;
  }

  confirmToSend() {
    if (this.checkValidEmail(this.resetPasswordEmail)) {
      console.log(this.resetPasswordEmail);
      this.resetPasswordEmail = '';

      const btnRef = document.getElementById('closeBtn');
      btnRef?.click();

      // API Call to be done
    }
  }
}
