import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-agency-list',
  templateUrl: './agency-list.component.html',
  styleUrls: ['./agency-list.component.css']
})
export class AgencyListComponent implements OnInit {
  agencies: any[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  constructor(private backendApi: BackendService) { }

  ngOnInit(): void {
    this.fetchAgencies();
  }

  fetchAgencies(): void {
    this.isLoading = true;
    this.error = null;
/*     this.backendApi.getAgencies().subscribe({
      next: (response) => {
        // Ellenőrizzük, hogy a válasz tartalmazza-e az adatokat
        if (response && response.data && response.data.agencies) {
          this.agencies = response.data.agencies;
        } else {
          this.agencies = [];
          this.error = 'Nincs találat az ügynökségekre.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Hiba történt az ügynökségek lekérdezésekor:', err);
        this.error = 'Nem sikerült betölteni az ügynökségeket. Lehet, hogy a szerver nem elérhető.';
        this.isLoading = false;
      }
    }); */
  }
}