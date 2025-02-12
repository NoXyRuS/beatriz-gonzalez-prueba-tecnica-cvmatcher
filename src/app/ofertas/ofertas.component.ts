import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';  
import { HttpClientModule } from '@angular/common/http';
import { Location } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-ofertas',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './ofertas.component.html',
  styleUrls: ['./ofertas.component.css']
})
export class OfertasComponent implements OnInit {
  busqueda: string = '';
  filtro: string = '';
  lugar: string = '';
  ofertas: any[] = [];
  ofertasFiltradas: any[] = [];
  ofertaSeleccionada: any = null;
  experienciasDisponibles: any[] = [];
  salariosDisponibles: any[] = [];
  filtroExperiencia: string = ''; 
  filtroSalario: string = ''; 
  ofertasOriginales: any[] = [];
  totalOfertas: number = 0;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private http: HttpClient ,
    private location: Location,
    private cdRef: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const parametrosFiltro = params['busqueda'] || params['lugar'] || params['Experiencia'] || params['Salario'];
      if (parametrosFiltro) {
        this.router.navigate(['/ofertas']);
      } else {
        this.obtenerOfertas();
      }
      
      this.busqueda = params['busqueda'] || '';
      this.lugar = params['lugar'] || '';
      this.filtroExperiencia = params['Experiencia'] || ''; 
      this.filtroSalario = params['Salario'] || '';
      
      this.ofertaSeleccionada = this.ofertas.length > 0 ? this.ofertas[0] : null;
    });
  }

  toggleOfertas(oferta: any) {
    this.ofertaSeleccionada = oferta;
  }

  buscar() {
    if (!this.busqueda.trim() && !this.lugar.trim()) {
      return;
    }
    this.obtenerOfertas();
    this.actualizarUrl();
  }
  
  obtenerOfertas() {
    this.http.get<any[]>('assets/data/data-jobs.json')
      .subscribe(
        (data) => {
          this.ofertasOriginales = [...data];
          this.ofertas = data;
          this.totalOfertas = data.length;
          this.experienciasDisponibles = this.obtenerOpcionesUnicas('years_experience');
          this.salariosDisponibles = this.obtenerOpcionesUnicas('salary_min', 'salary_max');
          this.ofertas = this.filtrarOfertas(this.ofertas);
          this.ofertaSeleccionada = this.ofertas.length > 0 ? this.ofertas[0] : null;
        },
        (error) => {
          console.error('Error al obtener las ofertas', error);
        }
      );
  }

  actualizarFiltros() {
    this.ofertas = [...this.ofertasOriginales];
    this.ofertas = this.filtrarOfertas(this.ofertas);
    this.totalOfertas = this.ofertas.length;  
    this.ofertaSeleccionada = this.ofertas.length > 0 ? this.ofertas[0] : null;
    this.actualizarUrl();
  }

  obtenerOpcionesUnicas(propiedad1: string, propiedad2?: string): any[] {
    const opcionesUnicas = new Set();
    this.ofertas.forEach(oferta => {
      if (propiedad2) {
        if (oferta[propiedad1] && oferta[propiedad2]) {
          opcionesUnicas.add(`${oferta[propiedad1]} - ${oferta[propiedad2]}`);
        }
      } else {
        if (oferta[propiedad1]) {
          opcionesUnicas.add(oferta[propiedad1]);
        }
      }
    });
    return Array.from(opcionesUnicas);
  }

  filtrarOfertas(ofertas: any[]): any[] {
    return ofertas.filter(oferta => {
      let cumpleBusqueda = true;
      let cumpleLugar = true;
      let cumpleExperiencia = true;
      let cumpleSalario = true;

      if (this.busqueda.trim()) {
        cumpleBusqueda = oferta.title.toLowerCase().includes(this.busqueda.toLowerCase()) ||
                         oferta.description.toLowerCase().includes(this.busqueda.toLowerCase());
      }

      if (this.lugar.trim()) {
        cumpleLugar = oferta.location.toLowerCase().includes(this.lugar.toLowerCase());
      }

      if (this.filtroExperiencia) {
        cumpleExperiencia = oferta.years_experience == this.filtroExperiencia;
      }

      if (this.filtroSalario) {
        const salarioRango = this.filtroSalario.split('-');
        const salarioMin = parseInt(salarioRango[0]);
        const salarioMax = parseInt(salarioRango[1]);
        cumpleSalario = oferta.salary_min <= salarioMin && oferta.salary_max >= salarioMax;
      }

      return cumpleBusqueda && cumpleLugar && cumpleExperiencia && cumpleSalario;
    });
  }

  actualizarUrl() {
    let url = '/ofertas';
    const params: any = {};
    if (this.busqueda.trim()) {
      params['busqueda'] = this.busqueda;
    }
    if (this.lugar.trim()) {
      params['lugar'] = this.lugar;
    }
    if (this.filtroExperiencia.trim()) {
      params['Experiencia'] = this.filtroExperiencia;
    }
    if (this.filtroSalario.trim()) {
      params['Salario'] = this.filtroSalario;
    }
  
    if (Object.keys(params).length > 0) {
      url += '?' + new URLSearchParams(params).toString();
    }
  
    this.location.replaceState(url);
  }

  convertirUrl(texto: string): string {
    return texto.trim().toLowerCase().replace(/\s+/g, '-');
  }
}
