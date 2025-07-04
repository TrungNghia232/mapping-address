// src/app/shared/material/autocomplete.ts
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input'
import { ReactiveFormsModule } from '@angular/forms';
import {AsyncPipe} from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export const MATERIAL_AUTOCOMPLETE_IMPORTS = [
  MatFormFieldModule,
  MatInputModule,
  MatAutocompleteModule,
  MatOptionModule,
  ReactiveFormsModule,
  MatCardModule,
  MatIconModule,
  AsyncPipe
];
