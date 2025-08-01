import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AddressMappingComponent } from './components/address-mapping/address-mapping.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AddressMappingComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'mapping-address';
}
