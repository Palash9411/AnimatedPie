import { Injectable, ElementRef } from "@angular/core";
declare var $: any;

@Injectable()
export class pieChartService {
  
  nativeElement: any;
  resizeTimeout : any;
  resizableInit(imageResizable: ElementRef, elementData: any): any {
    var temporary={};
    this.nativeElement = imageResizable.nativeElement;
    if(this.nativeElement.classList.contains('pie-col')){
        $(this.nativeElement).resizable({
          minHeight: 30,
          minWidth: 30,
          maxHeight :  $(this.nativeElement)
          .closest(".donut-module")
          .width(),
          maxWidth: $(this.nativeElement)
          .closest(".donut-module")
          .width(),
          resize: (event, ui) =>{
            event.stopPropagation();
            event.originalEvent.stopPropagation();
            let calWidth ;
            // drag resize from corner 
            if(ui.originalSize.height != ui.size.height && ui.originalSize.width != ui.size.width){
              calWidth =( ui.size.width / $(ui)[0].element.parent().width() )* 100 +'%' ;
              $(ui)[0].element[0].style.height = calWidth; 
  
            }else {
              // drag resize when height is increased 
            if(ui.originalSize.height != ui.size.height){
              calWidth =( ui.size.height / $(ui)[0].element.parent().width() )* 100 +'%'
              $(ui)[0].element[0].style.height = calWidth; 
            }else{
              // drag resize when width is increased 
             calWidth =( ui.size.width / $(ui)[0].element.parent().width() )* 100 +'%' 
             $(ui)[0].element[0].style.height = calWidth; 
            }
          }
          if(this.resizeTimeout){
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = null ;
          }
           this.resizeTimeout= setTimeout(()=>{
              this.textWidthHandler(calWidth,$(ui)[0],elementData);
            },250)
            elementData['element_prop'].width = calWidth ;
          }
        
      })}
    }

    textWidthHandler(calWidth,ui,elementData){
        if(parseInt(elementData['element_prop'].width)>50 && ui.element[0].parentElement.parentElement.clientWidth > 360){
          ui.element[0].parentElement.children[2].style.display = 'block';
          ui.element[0].parentElement.children[2].style.width = '100%';
          ui.element[0].parentElement.children[2].style.paddingLeft = '12px'
        }else
          if(ui.element[0].parentElement.parentElement.clientWidth > 360){
        ui.element[0].parentElement.children[2].style.display = 'inline-block';
        ui.element[0].parentElement.children[2].style.width = 100-parseInt(elementData['element_prop'].width)-3+'%';
        ui.element[0].parentElement.children[2].style.paddingLeft = '30px'
          }
      }

    
    public count = 0 ;
addChildFonts(z,elementData,type?) {
  if (z.style && z.style.fontSize && this.count == 0) {
    let newSize = (((type ?elementData['element_content'].mobile_font_percent :  elementData['element_content'].font_size) * parseInt(z.style.fontSize)) / 100).toString() + 'px';
    z.style.fontSize = newSize;
  }
  if (z.style && !z.style.fontSize && this.count == 0) {
    let newSize = (((type ?elementData['element_content'].mobile_font_percent :  elementData['element_content'].font_size) * (type ? elementData['element_content'].font_size :15)) / 100).toString() + 'px';
    z.style.fontSize = newSize;
  }

  this.count++;
  if (z.childNodes.length > 0) {
    for (var i = 0; i < z.childNodes.length; i++) {
      if (z.childNodes[i] && z.childNodes[i].style && z.childNodes[i].style.fontSize) {
        let newSize = (((type ?elementData['element_content'].mobile_font_percent :  elementData['element_content'].font_size) * (parseInt(z.childNodes[i].style.fontSize.split('px')[0]))) / 100).toString() + 'px';
        z.childNodes[i].style.fontSize = newSize;
      }
      if(z.childNodes[i] && z.childNodes[i].style && !z.childNodes[i].style.fontSize){
        if(z.style && z.style.fontSize){
          z.childNodes[i].style.fontSize = z.style.fontSize; 
        }
        else{
          let newSize = (((type ?elementData['element_content'].mobile_font_percent :  elementData['element_content'].font_size) * (type ?   elementData['element_content'].font_size : 15) / 100)).toString() + 'px';
          z.childNodes[i].style.fontSize = newSize; 
        }
    }
      if (z.childNodes[i] && z.childNodes[i].style && z.childNodes[i].style.width) {
        let newSize = (((type ?elementData['element_content'].mobile_font_percent :  elementData['element_content'].font_size) * (parseInt(z.childNodes[i].style.width.split('px')[0]))) / 100).toString() + 'px';
        z.childNodes[i].style.width = newSize;
      }
      this.addChildFonts(z.childNodes[i],elementData,type?type:'');
    }
  }
}
}