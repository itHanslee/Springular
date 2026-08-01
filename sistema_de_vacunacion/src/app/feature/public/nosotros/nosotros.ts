import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicFooter } from '../components/public-footer/public-footer';
import { PublicHeader } from '../components/public-header/public-header';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [CommonModule, PublicHeader, PublicFooter],
  templateUrl: './nosotros.html',
  styleUrl: './nosotros.css',
})
export class Nosotros {}
