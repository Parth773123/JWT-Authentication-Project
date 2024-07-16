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
    private toast: ToastrService
  ) {}

  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa fa-eye-slash';
  loginForm!: FormGroup;

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
            timeOut: 5000,
          });
          this.loginForm.reset();
          this.auth.storeToken(res.token);
          this.router.navigate(['dashboard']);
        },
        error: (err) => {
          this.toast.error(err.error.message, 'ERROR', {
            timeOut: 5000,
          });
        },
      });
    } else {
      ValidateForm.validateAllFormFields(this.loginForm);
      alert('Form in not valid');
    }
  }
}
