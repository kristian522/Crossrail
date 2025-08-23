import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    private dataService: DataService
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
}