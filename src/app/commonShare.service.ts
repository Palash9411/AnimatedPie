import { Injectable} from "@angular/core";
import { Subject } from 'rxjs';


@Injectable()
export class commonService {

    varButtonClick = new Subject<any>();


}
