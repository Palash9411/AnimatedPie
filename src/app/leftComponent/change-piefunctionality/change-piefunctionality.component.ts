import { Component, OnInit } from '@angular/core';
import { commonService } from 'src/app/commonShare.service';

@Component({
  selector: 'app-change-piefunctionality',
  templateUrl: './change-piefunctionality.component.html',
  styleUrls: ['./change-piefunctionality.component.scss']
})
export class ChangePiefunctionalityComponent implements OnInit {

  constructor(private _commonService : commonService) { }

  ngOnInit() {
  }
  changePieCharthandler(type){
    this._commonService.varButtonClick.next(type? type : true);
  }
}
