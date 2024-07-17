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
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: ToastrService
  ) {}

  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa fa-eye-slash';
  signUpForm!: FormGroup;

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, this.passwordValidator]],
    });
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText
      ? (this.eyeIcon = 'fa fa-eye')
      : (this.eyeIcon = 'fa fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }

  onSignUp() {
    if (this.signUpForm.valid) {
      console.log('Sign Up Successful');

      this.auth.signUp(this.signUpForm.value).subscribe({
        next: (res) => {
          this.toast.success(res.message, 'SUCCESS', {
            timeOut: 3000,
          });
          this.signUpForm.reset();
          this.router.navigate(['login']);
        },
        error: (err) => {
          if (err.error && err.error.message) {
            this.toast.error(err.error.message, 'ERROR', {
              timeOut: 3000,
            });
          } else {
            alert('An error occured, Please try again later');
          }
        },
      });
    } else {
      ValidateForm.validateAllFormFields(this.signUpForm);
      alert('Form in not valid');
    }
  }

  private passwordValidator(
    control: AbstractControl
  ): { [key: string]: any } | null {
    const value = control.value;

    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const validateLength = value.length >= 8;

    const password =
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialCharacter &&
      validateLength;

    if (!password) {
      return { invalidPassword: true };
    }

    return null;
  }
}
