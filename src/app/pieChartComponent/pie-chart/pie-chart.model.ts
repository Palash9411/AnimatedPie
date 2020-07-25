import { PieChartElementInterface, element_propInterface } from 'src/app/Interface/pieChartInterface'

export class PieClass {
    element_prop = <element_propInterface>{}
    element_content = <PieChartElementInterface>{} 
    constructor (){
        this.element_prop._background  = '#ffffff' ;
        this.element_prop._colorScheme = '#04BFED';
        
        this.element_prop._type        = "_pieChart";
        this.element_prop._isAnimated = false;
        this.element_prop.width = '50%';
            
        this.element_prop._customMargin = {
            top:0,
            bottom:40
          }
          this.element_prop._mobileMargin = {
            top:0,
            bottom:30
          }
        /**
        * Content defined
        */
       this.element_content.pie_title = 'Pie Chart';

       this.element_content.pie_list = [];
       
       this.element_content.font_size = 60;
       this.element_prop._automated = true;
         for(let i = 0 ;i<5;i++){
            let pieChartObject = {
               text:this.setPieData(i),
               value:this.setValue(i),
               color : this.setPieColor(i)
            }
            this.element_content.pie_list.push(pieChartObject);
        }

    
    }
    setPieData(i){
        if(i===0){
        return `20% Financial services inculding management services (Section 1)`;
        }
         if(i===1) return `25% Executive,managers and supervisors (2nd Section)`;
        if(i===2) return `20% Government , teachers ,social services (Section 3) `;
        if(i===3) return `15% Blue collor or miscellenous services (Section 4)`;
        if(i===4) return `20% Arts ,media and sports (Section 5)`;
    }
    setPieColor(i){
    if(i===4) return '#C9D93B';
    if(i===0) return '#FEA63A';
    if(i===1) return '#FE693A';
    if(i===2) return '#7EB9DC';
    if(i===3)   return  '#2C76A2';
    }
    setValue(i){
        if( i===0) return 20;
        if(i===1) return  25;
        if(i===2) return 20;
        if(i===3) return 15;
        if(i===4)return  20;   
    }
}