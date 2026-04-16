import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { MisReservasComponent } from './components/mis-reservas/mis-reservas.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'catalogo', component: CatalogoComponent, canActivate: [authGuard] },
  { path: 'mis-reservas', component: MisReservasComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
