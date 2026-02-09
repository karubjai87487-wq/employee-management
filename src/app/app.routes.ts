import { Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { EmployeeDashboardComponent } from '../employee/employee-dashboard.component';
import { ManagerDashboardComponent } from './pages/manager-dashboard.component';
import { HrAdminDashboardComponent } from './pages/hr-admin-dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: EmployeeDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['employee'] }
  },
  {
    path: 'manager-dashboard',
    component: ManagerDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['manager'] }
  },
  {
    path: 'hr-dashboard',
    component: HrAdminDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['hr_admin'] }
  }
];
