import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginModule } from './components/login/login.module';
import { CatalogoModule } from './components/catalogo/catalogo.module';
import { MisReservasModule } from './components/mis-reservas/mis-reservas.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    LoginModule,
    CatalogoModule,
    MisReservasModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
