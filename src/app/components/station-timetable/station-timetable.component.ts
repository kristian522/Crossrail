import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-station-timetable',
  templateUrl: './station-timetable.component.html',
  styleUrls: ['./station-timetable.component.css']
})
export class StationTimetableComponent implements OnInit {

  public stationName: string | null = '';
  public arrivalTimetable$: Observable<any[]>;
  public departuresTimetable$: Observable<any[]>;
  public stationInfo$: Observable<any>;
  public stationServices$: Observable<any[]>;
  
  // 1. Állapot tárolása: 'departures' (induló) vagy 'arrivals' (érkező)
  public currentView: 'departures' | 'arrivals' = 'departures';


  // 3. Egyetlen, a HTML által használt adatfolyam
  public displayTimetable$ = new BehaviorSubject<any[]>([]);



  constructor(
    private route: ActivatedRoute, // Ezzel tudjuk olvasni az URL paramétereit
    private dataService: DataService,
    private router: Router // <-- A Router injektálása
  ) {
    this.arrivalTimetable$ = this.dataService.arrivalTimetable$;
    this.departuresTimetable$ = this.dataService.departuresTimetable$;
    this.stationInfo$ = this.dataService.stationInfo$;
    this.stationServices$ = this.dataService.stationServices$;
    console.log(this.arrivalTimetable$);
    console.log(this.departuresTimetable$);
    console.log(this.stationInfo$);
    console.log(this.stationServices$);
  }

ngOnInit(): void {
    this.stationName = this.route.snapshot.paramMap.get('stationName');
    
    if (this.stationName) {
      this.dataService.fetchStationTimetableByName(this.stationName);
    }

    // Feliratkozunk a változásokra, hogy frissíteni tudjuk a megjelenítendő listát
    this.departuresTimetable$.subscribe(data => {
      if (this.currentView === 'departures') {
        this.displayTimetable$.next(data);
      }
    });

    this.arrivalTimetable$.subscribe(data => {
      if (this.currentView === 'arrivals') {
        this.displayTimetable$.next(data);
      }
    });
  }

   // 4. Metódus a nézet váltására, ezt hívják majd a gombok
  setView(view: 'departures' | 'arrivals'): void {
    this.currentView = view;
    // Azonnal frissítjük a megjelenítendő adatokat a kapcsoló állása szerint
    if (view === 'departures') {
      this.departuresTimetable$.subscribe(data => this.displayTimetable$.next(data));
    } else {
      this.arrivalTimetable$.subscribe(data => this.displayTimetable$.next(data));
    }
  }


  checkTrackColor(type: any) {
    if (type == "Plan") {
      return "black";
    }
    if (type == "FactPlanEqual") {
      return "green"
    }
    if (type == "FactPlanDifference") {
      return "red"
    }
    else {
      return "black";
    }
  }

  checkColor(ScedTime: any, ActualTime: any) {
    if (ScedTime < ActualTime && ScedTime != ActualTime) {
      return "red";
    }
    else {
      return "green";
    }
  }

  signColor(sign: any) {
    return "#" + sign;
  }

   /**
   * ÚJ METÓDUS: Átnavigál a kiválasztott vonat részletes információs oldalára.
   * @param train A vonat objektum, amire a felhasználó kattintott.
   */
  showTrainDetails(train: any): void {
    // Kiolvassuk a dátumot az aktuális URL query paramétereiből,
    // hogy tovább tudjuk adni a vonatinformációs oldalnak.
    const travelDate = this.route.snapshot.queryParamMap.get('date') || new Date().toISOString().split('T')[0];

    // Navigáció a '/train-info' útvonalra a vonat kódjával (számával)
    // és a dátummal, mint query paraméter.
    this.router.navigate(['/train-info', train.code], {
      queryParams: { date: travelDate }
    });
  }
}