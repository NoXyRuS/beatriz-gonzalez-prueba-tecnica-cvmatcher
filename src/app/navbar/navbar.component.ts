import { Component } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { OfertasComponent } from '../ofertas/ofertas.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [HomeComponent, OfertasComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(
    private router: Router
  ){}
  home() {
    this.router.navigate(['home']);
  }
  
  oferta() {
    this.router.navigate(['ofertas']);
  }

}
