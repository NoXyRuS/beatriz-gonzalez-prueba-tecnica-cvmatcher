import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ofertas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ofertas.component.html',
  styleUrl: './ofertas.component.css'
})
export class OfertasComponent implements OnInit {
  busqueda: string = '';
  filtro: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.busqueda = params['busqueda'] || '';
      this.filtro = params['filtro'] || '';
      this.obtenerOfertas();
    });
  }

  buscar() {
    if (!this.busqueda.trim()) return;

    let url = '/trabajo/' + this.convertirUrl(this.busqueda);
    if (this.filtro) {
      url += '/' + this.convertirUrl(this.filtro);
    }
    this.router.navigate([url]);
  }

  obtenerOfertas() {
    console.log(`Obteniendo ofertas para: ${this.busqueda}, con filtro: ${this.filtro}`);
  }

  convertirUrl(texto: string): string {
    return texto.trim().toLowerCase().replace(/\s+/g, '-');
  }
}
