import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastrService);

  if (auth.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['login']);
    toast.error('Please Login First', 'ERROR', {
      timeOut: 5000,
    });
    return false;
  }
};
