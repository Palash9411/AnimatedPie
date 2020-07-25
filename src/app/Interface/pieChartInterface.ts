export interface PieChartElementInterface {
    pie_title: string;
    pie_subTitle: string;
    pie_content: string;
    pie_list: Array<PieChartElementValuesInterface>;
    font_size : number ; 
  }

  interface PieChartElementValuesInterface {
    value: number;
    text: string;
    color: string;
  }


  export interface element_propInterface {
  _type: string;
  _alignment_class?: string;
  listItemMarginBOttom?:number;
  height?: any;
  width?: any;
  _background: string;
  _colorScheme: string;
  _columnId: string;
  _parentsId: any;
  _header: boolean;
  _header_color: string;
  _show_header: boolean;
  header_content: string;
  _allowElementColor: boolean;
  _backgroundChart: string;
  grid_color:string,
  font_color:string,
  header_sidebar_color:string;
  _day_color:string;
  icon_color:string;
  icon_backColor:string;
  iconFontSize :number;
  commonColor:string;
  _element_border:boolean;
  _element_border_color:boolean;
  _border:boolean;
  _border_color:boolean;
  _image_size:string;
  _image_height:string;
  _icon_color : string ;
  _isAnimated : boolean ;
  _forIE:number;
  _icon_size:number;
  _element_outer_border_color?:string;
  _element_border_width?:number;
  _element_border_style?:string;
  _element_outer_border_radius?:number;
  _horizontal_list_connector_padding?:number;
  _list_type:string;
  _list_connector: string;
  _commonIconBorderColor:string;
  _commonIconBackgroundColor : string;
  _padding:Number;
  _sliderButtonProp :Object;
  _list_connectorColor:string;
  text_border_thickness:number;
  text_border_radius: number;
  _text_border: boolean;
  _text_border_color:string;
  _text_border_width:number ;
  _image_border : boolean ;
  border_color:string ;
  border_width:number;
  border_radius:number ;
  _alignType :any ;
  _customMargin:object;
  _automated:boolean;
  _mobileMargin;
  border_visible : boolean,
}