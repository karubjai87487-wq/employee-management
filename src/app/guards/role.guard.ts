import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const user = localStorage.getItem('user');
    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    const userData = JSON.parse(user);
    const requiredRoles = route.data['roles'] as string[];

    if (requiredRoles && requiredRoles.includes(userData.role)) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
