import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AddressMappingComponent } from './components/address-mapping/address-mapping.component';
import { OldAddressInputComponent } from './components/old-address/old-address-input.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AddressMappingComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'mapping-address';
}
