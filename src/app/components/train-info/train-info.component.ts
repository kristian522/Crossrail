import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-train-info',
  templateUrl: './train-info.component.html',
  styleUrls: ['./train-info.component.css']
})
export class TrainDetailsComponent implements OnInit {

  public trainNumber: string | null = '';
  public trainDetails$: Observable<any>;
  public trainScheduler$: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router
  ) {
    this.trainDetails$ = this.dataService.trainDetails$;
    this.trainScheduler$ = this.dataService.trainScheduler$;
    console.log(this.trainDetails$);
    console.log(this.trainScheduler$);
  }

  ngOnInit(): void {
    // Kiolvassuk a 'trainNumber'-t az útvonalból
    this.trainNumber = this.route.snapshot.paramMap.get('trainNumber');
    
    // A dátumot a query paraméterek közül olvassuk ki (pl. ?date=2025-08-11)
    const travelDate = this.route.snapshot.queryParamMap.get('date');

    if (this.trainNumber && travelDate) {
      this.dataService.fetchTrainDetails(this.trainNumber, travelDate);
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
      return "#"+sign; 
  }

  /**
   * ÚJ METÓDUS: Átnavigál a kiválasztott állomás információs oldalára.
   * @param stop A megálló objektum, amire a felhasználó kattintott.
   */
  showStationDetails(stop: any): void {
    // Kiolvassuk a dátumot az aktuális URL-ből.
    const travelDate = this.route.snapshot.queryParamMap.get('date') || new Date().toISOString().split('T')[0];

    // Navigáció a '/station-info' útvonalra az állomás nevével
    // és a dátummal, mint query paraméter.
    this.router.navigate(['/station-info', stop.station.name], {
      queryParams: { date: travelDate }
    });
  }
}