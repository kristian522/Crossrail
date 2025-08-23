import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
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


  constructor(
    private route: ActivatedRoute, // Ezzel tudjuk olvasni az URL paramétereit
    private dataService: DataService
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
    // Kiolvassuk az 'stationName' paramétert az URL-ből
    this.stationName = this.route.snapshot.paramMap.get('stationName');
    
    if (this.stationName) {
      // Itt indítjuk a tényleges adatlekérést a DataService-en keresztül
      this.dataService.fetchStationTimetableByName(this.stationName);
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
}