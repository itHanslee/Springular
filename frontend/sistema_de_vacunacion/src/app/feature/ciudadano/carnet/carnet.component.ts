import { Component } from '@angular/core';

@Component({
  selector: 'app-carnet',
  standalone: true,
  template: `
    <div class="carnet-panel">
      <h1>Panel Carnet</h1>
      <p>Aquí se mostrará el contenido del carnet.</p>
    </div>
  `,
  styles: [`.carnet-panel{padding:16px;font-family:Arial,Helvetica,sans-serif}`],
})
export class CarnetComponent {}
