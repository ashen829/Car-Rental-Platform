import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-placeholder',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './placeholder.html',
  styleUrl: './placeholder.scss'
})
export class PlaceholderComponent {

}
