import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import {PieClass}  from '../pie-chart/pie-chart.model'
import { Subscription } from 'rxjs';
import { pieChartService } from '../../pieChartComponent/pie-chart/piechart.service';
import { commonService } from 'src/app/commonShare.service';
declare var Snap: any;
declare var $: any;

namespace COLOR {
  export const R = 5;
  export const G = 43;
  export const B = 62;
}
var colorObj = {};
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {
public elementData : object = {};
public isValueExceed = false;
private randomColor = require('randomcolor');
options: object;
dataOptions = [];
public myColumnInfo: object;
public addNewClass: boolean = false;
private s;
public editMode:boolean = false;
public addGutterBtns = false;
public gutterSubscription;
private pathGroup;
private radius: number = 1;
private colorArr: Array<string> = [];
public globalStyleSubscription:Subscription;
public random = Math.floor(Math.random() * 10000);
public LineArray = [];
public IntervalArray = [];
public pieIntervalVar: boolean = true;
public getElmResizeSubscription : Subscription ;
public tempDiv: any;
public recentColorArray;
public clicTimeout: any;
public colorPickertimeout: any;
public LineDrawTimeout: any;
public arr = [];
@ViewChild("imageResizable", { static: false }) imageResizable: ElementRef;
public popover = {
  open: false
};
public parts = [];
public mobileView : boolean = false ;
public is_iPad : boolean  ;
public buttonClickSub : Subscription ;
private sum = 0;
private count1 = 0   ; 
  count: number;
  constructor(private renderer: Renderer2,
              private el: ElementRef,
              private pieChartService : pieChartService,
              private _commonService : commonService
               ){ }

  ngOnInit() {
// creating instance of pie class 
    this.elementData = new PieClass();

  this.buttonClickSub =   this._commonService.varButtonClick.subscribe(data=>{
      if(data == 'add' ){
        this.addIntoPieChart();
      }else{
      this.elementData['element_prop']._isAnimated = !this.elementData['element_prop']._isAnimated ;
      this.pieIntervalVar = false;
      this.clearPieInterval();
      clearTimeout(this.clicTimeout);
      clearTimeout(this.LineDrawTimeout);
      this.cleanAndReDrawOieChart();
      document.getElementById(`svg${this.random}`).setAttribute("viewBox","-1.2 -1.2 2.4 2.4");
     setTimeout(()=>{
      if(window.outerWidth<769){
        document.getElementById('auto'+this.random).style.fontSize = null
      }
     }) 
    }
    })
    
      this.colorArr = this.randomColor({
        count: this.elementData['element_content'].pie_list.length,
        hue: this.elementData['element_prop']._colorScheme
      });

      this.renderer.setAttribute(this.el.nativeElement.querySelector('svg'), 'id', "svg" + this.random);

      this.initializeData();
      this.createPieChart();
  }
  ngAfterViewInit() {
    if(window.outerWidth<769){
      document.getElementById('auto'+this.random).style.fontSize = '30px'
    }
    if(!this.elementData['element_prop'].width && this.elementData['element_prop'].width !=0){
      
      var ele =  document.getElementById('pieChartBlock'+this.random);
      if(ele.clientWidth > 484 && ele.clientWidth <574){
        this.elementData['element_prop'].width = '27%'
      }else if (ele.clientWidth >574){
        this.elementData['element_prop'].width = '17%'
      }else{
      this.elementData['element_prop'].width=document.getElementById('image'+this.random).clientWidth/document.getElementById('pieChartBlock'+this.random).clientWidth*100+'%' ;
      }
    }
    this.resizeableBorderHandler();
    if( this.elementData['element_prop']._isAnimated){
    document.getElementById(`svg${this.random}`).setAttribute("viewBox","-1.2 -1.2 2.4 2.4");
    }

 
  this.childFontHandler() ;
    setTimeout (()=>{
        document.getElementById(`svg${this.random}`).style.width ='';
        document.getElementById(`svg${this.random}`).style.height ='';
    },1000)
    
    if( this.elementData['element_prop'].width){
      
      var pie = document.getElementById(`pie${this.random}`).clientWidth;
      if (this.elementData['element_prop']._isAnimated ) {
          let calc  =  (pie * (parseInt(this.elementData['element_prop'].width)/100)) ;
          document.getElementById(`svg${this.random}`).style.width=calc+'px' ;
          document.getElementById(`svg${this.random}`).style.height=calc+'px' ;
        }
       if(this.mobileView){
         document.getElementById('image'+this.random).style.width = '80%'
        let calc  =  (pie * 80/100) ;
        document.getElementById(`svg${this.random}`).style.width=calc+'px' ;
        document.getElementById(`svg${this.random}`).style.height=calc+'px' ;
      }
       
    }
    
  }

  public addIntoPieChart() {
    this.colorArr = [];
    this.colorArr = this.randomColor({
      count: this.elementData['element_content'].pie_list.length + 1,
      hue: this.elementData['element_prop']._colorScheme
    });

    let newArc = {
      text: '10% new section ' + (this.elementData['element_content'].pie_list.length + 1),
      value: 10,
      color: this.colorArr[this.colorArr.length - 1]
    }
    this.elementData['element_content'].pie_list.push(newArc);
    
    
    
    this.parts.push(newArc.value);
    this.pieIntervalVar = false;
      this.clearPieInterval();
      clearTimeout(this.clicTimeout);
      clearTimeout(this.LineDrawTimeout);
      this.cleanAndReDrawOieChart();
  }
  trigger(event) {
    if (this.elementData['element_prop']._isAnimated) {
      this.pieIntervalVar = false;

      this.clearPieInterval();
      this.cleanAndReDrawOieChart();
    }
  }
    public resizeableBorderHandler() {
      $('#image' + this.random).hover(() => {
        $('#img-support-right' + this.random).addClass('makeItVisible');
        $('#img-support-bottom' + this.random).addClass('makeItVisible');
        $('#img-support-left'+this.random).addClass('makeItVisible');
        $('#img-support-top'+this.random).addClass('makeItVisible');  
      }, () => {
        $('#img-support-right' + this.random).removeClass('makeItVisible');
        $('#img-support-bottom' + this.random).removeClass('makeItVisible');
        $('#img-support-left' + this.random).removeClass('makeItVisible');
        $('#img-support-top' + this.random).removeClass('makeItVisible');

      });
    
  }
  
  resizedContainer(){
  
    setTimeout(()=>{
      this.pieChartService.resizableInit(this.imageResizable,this.elementData)
       this.setTextBlock();
          
    },500)
  }
  childFontHandler(){
    if((window.outerWidth<769 || this.is_iPad) ){
      this.arr[0]= document.getElementById('auto'+this.random) ;
      for(let i =0 ; i<this.elementData['element_content'].pie_list.length ; i++){
        this.arr[i+1] = document.getElementById('pie'+this.random+'-'+i);
      }
      for(let j =0 ; j<this.arr.length ; j++){
        this.pieChartService.count = 0 ;
        this.arr[j] ? this.pieChartService.addChildFonts(this.arr[j],this.elementData):'';
      }
    }
  }
    setText(){
      var textBlock = document.getElementById('pieTextArea'+this.random);
      var pieBlock = document.getElementById('pieChartBlock'+this.random);
      textBlock.style.display = 'block';
      textBlock.style.width = '100%';
      textBlock.style.paddingLeft = '12px'
    }
      setTextBlock(){
        var textBlock = document.getElementById('pieTextArea'+this.random);
        var pieBlock = document.getElementById('pieChartBlock'+this.random);
        if( pieBlock.offsetWidth < 360 || textBlock.clientWidth <190 ){
          textBlock.style.display = 'block';
          textBlock.style.width = '100%';
          textBlock.style.paddingLeft = '12px'
        }else if(pieBlock.offsetWidth > 360 && this.elementData['element_prop'].width && parseInt(this.elementData['element_prop'].width) > 50 ){
            textBlock.style.display = 'block';
            textBlock.style.width = '100%';
            textBlock.style.paddingLeft = '12px'
          }else{
          textBlock.style.display = 'inline-block';
          textBlock.style.width = 100-parseInt(this.elementData['element_prop'].width)-3+'%';
          textBlock.style.paddingLeft = '30px'
          }
      }
    private initializeData() {
      let z = "#svg" + this.random;
      this.s = Snap(z);
      this.pathGroup = this.s.group();
  
      this.elementData['element_content'].pie_list.forEach((value, key) => {
        this.parts.push(value.value);
        this.sum = +value.value;
        value.color = value.color == null ? this.colorArr[key] : value.color;
        colorObj[value.color] = true;
      })
    }
 
  PieValchange(e,data,index){
    if(!parseInt(e.currentTarget.innerText)){
      data.element_content.pie_list[index].value = 0;
    }else{
    data.element_content.pie_list[index].value = parseInt(e.currentTarget.innerText);
    }
    this.parts[index]=data.element_content.pie_list[index].value
    this.cleanAndReDrawOieChart();
  }

  public removeThisArc(index) {
    event.stopImmediatePropagation();

    this.parts.splice(index, 1);
    this.elementData['element_content'].pie_list.splice(index, 1);
    this.LineArray.splice(index, 1);
    this.pathGroup.remove();
    this.pathGroup = this.s.group();

    if ( this.elementData['element_prop']._isAnimated) {
      this.pieIntervalVar = false;
      this.clearPieInterval();
    }
    this.cleanAndReDrawOieChart();



  }
  private cleanAndReDrawOieChart(event?) {

    this.pathGroup.remove();
    this.pathGroup = this.s.group();
 
    this.createPieChart(event);
  }

  
  public addData() {
    this.pathGroup.remove();
    this.pathGroup = this.s.group();
    var randomNumber = 50 + Math.random() * 100;
    this.parts.push(randomNumber);
    //getRandomColor();
    this.createPieChart();
  }
  changeData() {
    this.pathGroup.remove();
    this.pathGroup = this.s.group();
    for (var i = 0; i < this.parts.length; i++) {
      var randomNumber = 50 + Math.random() * 100;
      this.parts[i] = randomNumber;
    }
 
    this.createPieChart();
  }
  private createPieChart(event?) {
 
    this.checkTotalPercentage();
    var total = this.parts.reduce((a, b) => a + b, 0);
    var prevAnglesSum = 0;
    var co_ordinateCount = 1;
    var prevCo_Ordinate = [0, this.radius];
    var tempCalAngle = 0;
    var cirleArcType = 0;
    var singleArcAngle;
    var coOrdinateArray = [];
    for (var i = 0; i < this.parts.length; i++) {
      if (event && event.toLowerCase() == 'color') {
        this.elementData['element_content'].pie_list[i].color = this.colorArr[i];
      }
      let percentage = (this.parts[i] / total) * 100;
      prevAnglesSum = prevAnglesSum + 3.6 * percentage;
      singleArcAngle = 3.6 * percentage;
      if (singleArcAngle > 360) {
        cirleArcType = 2;
      } else if (singleArcAngle > 180) {
        cirleArcType = 1;
      } else {
        cirleArcType = 0;
      }
      if (prevAnglesSum <= 90) {
        tempCalAngle = prevAnglesSum;
        co_ordinateCount = 1;
      } else if (prevAnglesSum > 90) {
        tempCalAngle = prevAnglesSum - 90;
        co_ordinateCount = 2;
      } else if (prevAnglesSum > 180) {
        tempCalAngle = prevAnglesSum - 180;
        co_ordinateCount = 3;
      } else if (prevAnglesSum > 270) {
        tempCalAngle = prevAnglesSum - 270;
        co_ordinateCount = 4;
      }
      var co_ordinate = this.calCoordinate(tempCalAngle, co_ordinateCount);
      co_ordinate[2] = prevCo_Ordinate[0];
      co_ordinate[3] = prevCo_Ordinate[1];
      coOrdinateArray.push(co_ordinate);
      // if()
      this.createPath(co_ordinate, cirleArcType, i);
      prevCo_Ordinate = co_ordinate;
    }
  }
  private getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    if (!colorObj[color]) {
      colorObj[color] = true;
      // colorArr.push(color)
    } else {
      this.getRandomColor();
    }
    return color;
  }

  private calCoordinate(angleA, type) {
    var angleB = 90 - angleA;
    var sideA, sideB;
    var x1, y1;
    sideA = this.radius * Math.sin((Math.PI / 180) * angleA);
    sideB = this.radius * Math.sin((Math.PI / 180) * angleB);
    if (type === 1) {
      x1 = +sideA;
      y1 = +sideB;
    } else if (type === 2) {
      x1 = +sideB;
      y1 = -sideA;
    } else if (type === 3) {
      x1 = -sideA;
      y1 = -sideB;
    } else if (type === 4) {
      x1 = -sideB;
      y1 = +sideA;
    }
    return [x1, y1];
  }
  private createPath(co_ordinate?, type?, index?) {
    var color1 = this.getRandomColor();
    if (type === 2) {
      var linePath = `M ${this.radius} 0 A${this.radius} ${this.radius} 0 1 1 ${this.radius -
        0.01} 0 L ${this.radius} ${this.radius} Z`;
      var lineLength = Snap.path.getTotalLength(linePath);
      var lineDraw = this.s.path(linePath);
      lineDraw.attr({ fill: this.elementData['element_content'].pie_list[index].color });
      this.pathGroup.append(lineDraw);
    } else {
      var x1 = co_ordinate[2],
        y1 = co_ordinate[3],
        x2 = co_ordinate[0],
        y2 = co_ordinate[1];
      var linePath = `M ${y1} ${x1} A ${this.radius} ${this.radius} 0 ${type} 1 ${y2} ${x2} L 0 0`;
      var lineLength = Snap.path.getTotalLength(linePath);
      var lineDraw = this.s.path(linePath);
      lineDraw.attr({ fill: this.elementData['element_content'].pie_list[index].color, id: "svg_" + this.random });
      this.pathGroup.append(lineDraw);
      this.LineArray[index] = lineDraw;

      lineDraw.click(() => {
        if ( this.elementData['element_prop']._isAnimated) {
          this.pieIntervalVar = false;
          this.clearPieInterval();
          clearTimeout(this.clicTimeout);
          clearTimeout(this.LineDrawTimeout);
          if (this.tempDiv) {
            var myInvertedMatrix = new Snap.Matrix();
            this.tempDiv.animate({ transform: myInvertedMatrix }, 100)
            this.lineDrawclickAnimation(lineDraw, index)
          } else {
            this.LineDrawTimeout = setTimeout(() => {
              this.lineDrawclickAnimation(lineDraw, index)
            }, 1000)
          }
          this.clicTimeout = setTimeout(() => {
            this.pieIntervalVar = false;

            this.clearPieInterval();
            this.cleanAndReDrawOieChart();

          }, 6000)

        }
      }
      )

      setTimeout(() => {
        if (this.elementData['element_prop']._isAnimated) {
          this.pieIntervalVar = true;
          this.count1 = 0 ;
          (this.parts.length - 1 == index) ? this.animationTimeInterval() : '';
        }
      }
        , 2000)
    }
  }
  
  // foo(event, index) {
  //   clearTimeout(this.colorPickertimeout);
  //   this.elementData['element_content'].pie_list[index].color = event;
  //   this.colorPickertimeout = setTimeout(() => {
  //     clearTimeout(this.clicTimeout);
  //     this.clearAndRedraw()
  //   })
  // }
  
  clearAndRedraw() {
    this.pieIntervalVar = false;
    this.clearPieInterval();
    this.cleanAndReDrawOieChart();

  }
  public clearPieInterval() {
    for (let i = 0; i < this.IntervalArray.length; i++) {
      clearInterval(this.IntervalArray[i])
      this.IntervalArray[i]=null;
    }
  }
  lineDrawclickAnimation(lineDraw, index) {

    let myMatrix = new Snap.Matrix();
    myMatrix.scale(1, 1)
    this.tempDiv = lineDraw;
    myMatrix.scale(1.2, 1.2);
    lineDraw.animate({ transform: myMatrix }, 300);
    this.count = 0;

    for (let i in this.elementData['element_content'].pie_list) {
      if (document.getElementById(`displayDiv${i}-${this.random}`)) {
        document.getElementById(`displayDiv${i}-${this.random}`).style.display = "none";
      }
    }
    if (document.getElementById(`displayDiv${index}-${this.random}`)) {
      document.getElementById(`displayDiv${index}-${this.random}`).style.display = "flex";
    }
  }
  // animation function 
  async animationTimeInterval() {
    let i = 0
    while (i < this.LineArray.length) {
      if(this.count1!=0){
      let pro = new Promise((res, rej) => {
        this.IntervalArray[i] = setTimeout(() => {
          if (this.pieIntervalVar) {
              for (let i in this.elementData['element_content'].pie_list ) {
                if (document.getElementById(`displayDiv${i}-${this.random}`)) {
                  document.getElementById(`displayDiv${i}-${this.random}`).style.display = "none";
                  }
              }
           res(this.animateChartPath(this.LineArray[i], i))
          }
        }, 2000)
      });
      await pro;
    }else {
      
      this.count1+=1;
    }
    
      if (i == this.LineArray.length - 1) {
        i = 0;
      } else {
        i++;
      }
    }
    if (!this.pieIntervalVar) {
      this.clearPieInterval();
    }
  }
  clickTest(e){
    e.stopPropagation();
  }

  animateChartPath(lineDraw, index) {
    let myMatrix = new Snap.Matrix();
    myMatrix.scale(1.2, 1.2);
    var myInvertedMatrix = new Snap.Matrix();
    myMatrix.scale(1, 1);
      if (document.getElementById(`displayDiv${index}-${this.random}`)) {
        document.getElementById(`displayDiv${index}-${this.random}`).style.display = "flex";
      }
    lineDraw.animate({ transform: myMatrix }, 1400, function () {
      lineDraw.animate({ transform: myInvertedMatrix }, 600);
    }.bind(this));
    return {}
  }

  checkTotalPercentage() {
 
    var totalValue = this.elementData['element_content'].pie_list
      .map(ele => ele.value)
      .reduce((val, total) => {
        return total + val;
      });
    this.isValueExceed = (totalValue != 100);
  }
  ngOnDestroy() {
    this.pieIntervalVar = false;
    this.clearPieInterval();
    if(this.buttonClickSub){
      this.buttonClickSub.unsubscribe();
    }
  }
}
