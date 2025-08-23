import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
  title = 'Crossrail';
  username: string = 'Krisztián';
  currentDate: string = '';
  currentTime: string = '';
  private timer: any;
  havariaMessage: string = 'Ez a verzió már nem támogatott. Kérjük, frissítsen a legújabb verzióra!'; // Statikus szöveg, ezt majd a backendről fogjuk betölteni
  showGlobalElements: boolean = true; // Változó a globális elemek megjelenítéséhez

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.timer = setInterval(() => {
      this.currentTime = new Date().toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }, 1000);

    this.currentDate = new Date().toLocaleDateString('hu-HU', { year: 'numeric', month: '2-digit', day: '2-digit' });
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  // Ez a metódus fut le, amikor a modál 'formSubmitted' eseményt küld
  onFormSubmitted(event: { title: string, value1: string, value2: string }): void {
    console.log('Form adatok megérkeztek az AppComponentbe:', event);

    switch (event.title) {
      case 'Állomásinformáció':
        let stationDate = this.formatDate(event.value2 || new Date());
        this.router.navigate(['/station-info', event.value1], { queryParams: { date: stationDate } });
        break;

      case 'Vonatinformáció':
        let trainDate = this.formatDate(event.value2 || new Date());
        this.router.navigate(['/train-info', event.value1], {
          queryParams: { date: trainDate }
        });
        break;

      // Ide jöhetnek a további menüpontok esetei
    }
  }

  /**
   * Segédfüggvény, ami a Dátum objektumot vagy stringet
   * YYYY-MM-DD formátumra alakítja.
   */
  private formatDate(dateInput: string | Date): string {
    const date = new Date(dateInput);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

