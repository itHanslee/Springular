import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ciudadanos',
  imports: [],
  templateUrl: './ciudadanos.html',
  styleUrl: './ciudadanos.css',
})
export class Ciudadanos {
  constructor(private router: Router) {}

  irAConsultarCertificado(): void {
    this.router.navigate(['/login']);
  }
}
