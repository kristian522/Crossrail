import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service'; // <-- Importáljuk a szolgáltatást
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'; // <-- Új import a reaktív űrlapokhoz

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css'],

})
export class SearchFormComponent implements OnInit {
  stations: any[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  searchForm = new FormGroup({
    fromPlace: new FormControl(''),
    toPlace: new FormControl('')
  });

  constructor(private backendService: BackendService) { }

  ngOnInit(): void {
    this.isLoading = true;
/*     this.backendService.getStations().subscribe({
      next: (response) => {
        console.log('Válasz a backend szervertől (stations):', response);
        // Ez a kód próbálja feldolgozni a választ.
        if (response && response.stations) { // <-- Ellenőrizzük, hogy a stations mező létezik-e
          this.stations = response.stations.sort((a: any, b: any) => a.name.localeCompare(b.name, 'hu'));
        } else {
          this.stations = [];
          this.error = 'Nem sikerült betölteni az állomásokat.';
          console.error('Hibás válaszformátum a backend szervertől:', response);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Hiba történt a frontend hívásakor:', err);
        this.error = 'Hiba a betöltés során';
        this.isLoading = false;
      }
    }); */
  }

  onSubmit(): void {
    const from = this.searchForm.value.fromPlace;
    const to = this.searchForm.value.toPlace;
    if (from && to) {
      console.log('Keresési adatok:', from, to);
      // TODO: Itt fogjuk a vonatinformációkat lekérdezni
    } else {
      alert('Kérlek add meg az indulási és érkezési helyet!');
    }
  }
}