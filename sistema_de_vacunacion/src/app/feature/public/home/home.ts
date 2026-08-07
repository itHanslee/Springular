// feature/public/home/home.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PublicHeader } from '../components/public-header/public-header';
import { PublicFooter } from '../components/public-footer/public-footer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PublicHeader, PublicFooter],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  constructor(private router: Router) {}

  irAConsultarCertificado(): void {
    this.router.navigate(['/login-ciudadano']);
  }
}