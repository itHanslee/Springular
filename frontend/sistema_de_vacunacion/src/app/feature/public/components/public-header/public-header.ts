// feature/public/components/public-header/public-header.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-public-header',
  standalone: true,
  templateUrl: './public-header.html',
  styleUrl: './public-header.css'
})
export class PublicHeader {
  menuAbierto: boolean = false;

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
  }
}
