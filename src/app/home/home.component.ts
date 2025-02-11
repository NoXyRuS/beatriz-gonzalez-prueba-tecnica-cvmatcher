import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  nombre: string = 'Beatriz González';

}
