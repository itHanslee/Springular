// shared/components/app-header/app-header.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './app-header.html',
  styleUrl: './app-header.css'
})
export class AppHeader {
  @Input({ required: true }) nombreUsuario = '';
}
