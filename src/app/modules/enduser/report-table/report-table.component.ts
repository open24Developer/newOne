import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router'
import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { StorageSessionService } from '../../../service/storage-session.service';
import { HttpClient } from '@angular/common/http';
import { ConfigServiceService } from '../../../service/config-service.service';
import { DialogChartsComponent } from './dialog-charts/dialog-charts.component';
import {Globals} from './../../../service/globals';

@Component({
  selector: 'app-report-table',
  templateUrl: './report-table.component.html',
  styleUrls: ['./report-table.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ReportTableComponent implements OnInit, AfterViewInit {
  columnsToDisplayKeys: string[];
  domain_name = this.globals.domain_name;
  private aptUrlPost_report = "https://" + this.domain_name + "/rest/Process/Report";
  @ViewChild(MatSort) sort: MatSort;
  constructor(private dataStored: StorageSessionService,
    private https: Http,
    private route: Router,
    private data: ConfigServiceService,
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private globals:Globals
  ) { }
  pointer = 0;
  V_SRC_CD = this.dataStored.getSession("agency");
  V_USR_NM = this.dataStored.getSession("email");
  Exe_data = this.dataStored.getSession("Exe_data");
  iddata: any[] = [];
  Table_of_Data: any[];
  Table_of_Data1: any[];
  Table_of_Data2: any[] = [];
  Table_of_Data3: any[] = [];
  Table_of_Data4: any[] = [];
  APP_ID = "";
  PRCS_ID = "";
  SRC_ID = "";
  SRVC_ID = "";
  SRVC_CD = "";
  PRCS_TXN_ID = "";
  F1: any[];
  ArraData: any = [];
  Table_of_Data5: any;
  helpertext = {};
  tabledata = {};
  showchoice: string = "showboth";
  dispchart: boolean;
  disptable: boolean;
  getReportData() {

    this.Table_of_Data = this.dataStored.getCookies('report_table')['RESULT'];
    //(this.dataStored.getCookies('report_table'));
    this.SRVC_CD = this.dataStored.getCookies('report_table')['SRVC_CD'][0];
    this.SRVC_ID = this.dataStored.getCookies('report_table')['SRVC_ID'][0];
    this.Table_of_Data1 = this.dataStored.getCookies('report_table')['LOG_VAL'];
    this.iddata.push(this.dataStored.getCookies('iddata'));
    this.PRCS_TXN_ID = this.dataStored.getCookies('executeresdata')['V_PRCS_TXN_ID'];
    this.APP_ID = this.dataStored.getCookies('iddata')['V_APP_ID'][0];
    this.PRCS_ID = this.dataStored.getCookies('iddata')['V_PRCS_ID'][0];
    this.SRC_ID = this.dataStored.getCookies('iddata')['V_SRC_ID'][0];

    //(JSON.parse(this.Table_of_Data1[0]));

    this.columnsToDisplay = Object.keys(JSON.parse(this.Table_of_Data1[0]));
  }
  dataSource = new MatTableDataSource(this.Table_of_Data4);
  columnsToDisplay = [];
  private apiUrlGet = "https://"+this.domain_name+"/rest/E_DB/SP?";
  ngAfterViewInit() {

    this.dataSource.sort = this.sort;
    //this.updatechart();
    this.cd.detectChanges();
  }
  showhide(abc) {
    switch (abc) {
      case 'showtable':
        this.disptable = true;
        this.dispchart = false;
        break;
      case 'showchart':
        this.disptable = false;
        this.dispchart = true;
        break;
      case 'showboth':
        this.disptable = true;
        this.dispchart = true;
        break;
    }
  }
  //___________________________Chart configuration ______________________________________
  yaxiscallbacks = ['$', '£', '€', '₹', 'm', 'km', 'k', 'gm', 'kg', 's'];
  V_PRF_NM = [];
  V_PRF_VAL = [];
  chartconfig = {};
  _yaxismin = 0;
  _yaxismax = null;
  _yaxisstepSize = null;
  _yaxisAutoskip: boolean = false;
  _xaxisAutoskip: boolean = false;
  _xaxis_sel = "";
  _yaxis1_sel = "";
  _yaxis2_sel = "";
  _yaxisCB = '';
  yaxis_data1 = [];
  yaxis_data2 = [];
  _backgroundColor = "rgba(34,181,306,0.2)";
  _borderColor = "rgba(44,191,206,1)";
  _fill: boolean = false;
  _borderdash = [];
  _pointstyle = "rectRot";
  _linetension = "none";
  _animations = "easeInOutQuad";
  _pointradius = "normal";
  _linestyle = "solid";
  lineten: number = 0;
  pointrad: number = 8;
  chartlabels = [];
  chartdata = [
    {
      data: this.yaxis_data1,
      label: this._yaxis1_sel,
      fill: this._fill,
      borderDash: this._borderdash,
      pointRadius: this.pointrad,
      pointStyle: this._pointstyle,
      yAxisID: 'y-1'
    },
    {
      label: this._yaxis2_sel,
      fill: this._fill,
      borderDash: this._borderdash,
      pointRadius: this.pointrad,
      pointStyle: this._pointstyle,
      data: this.yaxis_data2,
      yAxisID: 'y-2'
    }
  ];
  // Line Chart Configuration
  public lineChartColors: Array<any> = [];
  public lineChartData: Array<any> = this.chartdata;
  public lineChartLabels: Array<any> = this.chartlabels;
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';
  public lineChartOptions: any;
  // Bar Chart Configuration
  public barChartOptions: any;
  public barChartLabels: string[] = this.chartlabels;
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;
  public barChartData: Array<any> = this.chartdata;
  public barChartColors: Array<any> = [];
  // Pie Chart Configuration
  public pieChartLabels: string[] = this.chartlabels;
  public pieChartData: number[] = [65, 59, 80, 81, 56, 55, 40];
  public pieChartType: string = 'pie';

  // Doughnut Chart Configuration
  public doughnutChartLabels: string[] = this.chartlabels;
  public doughnutChartData: number[] = [65, 59, 80, 81, 56, 55, 40];
  public doughnutChartType: string = 'doughnut';

  //_________________________CHART FUNCTIONS________________________________________
  updateLineChart() {
    var unit = this._yaxisCB;
    
    this.yaxis_data1 = this.Table_of_Data5[this._yaxis1_sel].map(Number);
    this.yaxis_data2 = this.Table_of_Data5[this._yaxis2_sel].map(Number);
    switch (this._linetension) {
      case 'none': this.lineten = 0;
        break;
      case 'mild': this.lineten = 0.2;
        break;
      case 'full': this.lineten = 0.5;
        break;
      default: this.lineten = 0;
        break;
    }
    switch (this._pointradius) {
      case 'small': this.pointrad = 6;
        break;
      case 'normal': this.pointrad = 8;
        break;
      case 'large': this.pointrad = 10;
        break;
      default: this.pointrad = 6;
        break;
    }
    this._linestyle == "dashed" ? this._borderdash = [5, 5] : this._borderdash = [];
    this.lineChartColors = [
      {
        backgroundColor: this._backgroundColor,
        borderColor: this._borderColor,
        pointBackgroundColor: this._borderColor,
        pointBorderColor: '#fff',
        pointHoverBorderColor: this._borderColor,
        pointHoverBackgroundColor: '#fff',
      },
      {
        backgroundColor: "cyan",
        borderColor: "blue",
        pointBackgroundColor: "cyan",
        pointBorderColor: '#fff',
        pointHoverBorderColor: "blue",
        pointHoverBackgroundColor: '#fff',
      },
      {
        backgroundColor: "pink",
        borderColor: "violet",
        pointBackgroundColor: "pink",
        pointBorderColor: '#fff',
        pointHoverBorderColor: "violet",
        pointHoverBackgroundColor: '#fff',
      }
    ];
    this.lineChartOptions = {
      responsive: true,
      annotation: {
        drawTime: 'afterDatasetsDraw',
        events: ['click'],
        annotations: [{
          type: 'line',
          id: 'vline',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: "Jan-2018",
          borderColor: 'rgba(0, 255, 0, 0.6)',
          borderWidth: 1,
          label: {
            backgroundColor: 'rgba(0,0,0,0.5)',
            fontFamily: "sans-serif",
            fontSize: 12,
            fontStyle: "bold",
            fontColor: "#fff",
            xPadding: 6,
            yPadding: 6,
            cornerRadius: 6,
            xAdjust: 0,
            yAdjust: 0,
            enabled: true,
            position: "center",
            content: "Spend Plan Raised alot"
          }
        }]
      },
      legend: {
        labels: {
          usePointStyle: true
        }
      },
      elements:
      {
        point: {
          pointStyle: this._pointstyle
        },
        line: { tension: this.lineten },
        animation: {
          duration: 3000,
          easing: this._animations
        }
      },

      tooltips: {
        callbacks: {
          label: function (tooltipItems) {
            return (tooltipItems.yLabel.toString() + " " + unit);
          }
        },
        mode: 'index',
        intersect: false,
      },
      scales: {
        xAxes: [{
          ticks: {
            autoSkip: this._xaxisAutoskip
          },
          scaleLabel: {
            display: true,
            labelString: this._xaxis_sel
            //labelString: 'PIID'
          },
          display: true
        }],
        yAxes: [{
          position: 'left',
          type: 'linear',
          display: true,
          id: 'y-1',
          ticks: {
            min: this._yaxismin,
            max: this._yaxismax,
            stepSize: this._yaxisstepSize,
            autoSkip: this._yaxisAutoskip,
            suggestedMax: this._yaxismax + 10,
            beginAtZero: true,
            callback: function (label) {
              if (label > 10000) {
                return (label / 1000000);
              }
              else {
                return label + " " + unit;
              }

            },
            fontColor: this._borderColor
          },

          scaleLabel: {
            display: true,
            labelString: this._yaxis1_sel,
            fontColor: this._borderColor
          }
          //labelString: 'Ultimate Contract Value'}
        }, {
          type: 'linear',
          display: true,
          position: 'right',
          id: 'y-2',
          scaleLabel: {
            display: true,
            labelString: this._yaxis2_sel,
            fontColor: "blue"
          },
          beginAtZero: true,
          // grid line settings
          gridLines: {
            drawOnChartArea: false, // only want the grid lines for one axis to show up
          },
          ticks: {
            fontColor: "blue"
          }
        }
        ]
      }
    };
    this.lineChartData[0].fill = this._fill;
    this.lineChartData[0].borderDash = this._borderdash;
    this.lineChartData[0].pointRadius = this.pointrad;
    this.lineChartData[0].pointStyle = this._pointstyle;
    this.lineChartData[0].data = this.yaxis_data1;
    this.lineChartData[1].data = this.yaxis_data2;
    this.lineChartData[0].label = this._yaxis1_sel;
    this.lineChartData[1].label = this._yaxis2_sel;
    this.lineChartLabels = this.Table_of_Data5[this._xaxis_sel];
  }
  updateBarChart() {
    var unit = this._yaxisCB;
    this.barChartOptions = {
      scaleShowVerticalLines: false,
      responsive: true,
      legend: {
        labels: {
          usePointStyle: true
        }
      },
      elements:
      {
        animation: {
          duration: 3000,
          easing: this._animations
        }
      },

      tooltips: {
        callbacks: {
          label: function (tooltipItems) {
            return (tooltipItems.yLabel.toString() + " " + unit);
          }
        },
        mode: 'index',
        intersect: false,
      },
      scales: {
        xAxes: [{
          ticks: {
            autoSkip: false
          },
          scaleLabel: {
            display: true,
            labelString: this._xaxis_sel
          },
          display: true
        }],
        yAxes: [{
          position: 'left',
          type: 'linear',
          display: true,
          id: 'y-1',
          ticks: {
            min: this._yaxismin,
            max: this._yaxismax,
            stepSize: this._yaxisstepSize,
            autoSkip: this._yaxisAutoskip,

            beginAtZero: true,
            callback: function (label) {

              if (label > 10000) {
                return (label / 1000000);
              }
              else {
                return (label + " " + unit);
              }

            },

          },

          scaleLabel: {
            display: true,
            labelString: this._yaxis1_sel,
          }
          //labelString: 'Ultimate Contract Value'}
        }, {
          type: 'linear',
          display: true,
          position: 'left',
          id: 'y-2',
          scaleLabel: {
            display: true,
            labelString: this._yaxis2_sel,
          },
          beginAtZero: true,
          // grid line settings
          gridLines: {
            drawOnChartArea: false, // only want the grid lines for one axis to show up
          }
        }
        ]
      }
    };
    this.barChartColors = [
      {
        backgroundColor: this._backgroundColor,
        borderColor: this._borderColor,
        pointBackgroundColor: this._borderColor,
        pointBorderColor: '#fff',
        pointHoverBorderColor: this._borderColor
      }
    ];
    //(this.yaxis_data1);
    this.barChartData[0].data = this.yaxis_data1;
    this.barChartData[1].data = this.yaxis_data2;
    this.barChartData[0].label = this._yaxis1_sel;
    this.barChartData[1].label = this._yaxis2_sel;
    this.barChartLabels = this.Table_of_Data5[this._xaxis_sel];
  }
  updatechart() {
    this.updateLineChart();
    this.updateBarChart();
    if (this._yaxismax == null || this._yaxismax == undefined) {
      this._yaxismax = Math.max.apply(null, this.yaxis_data1);
      this.updateLineChart();
      this.updateBarChart();
    }
  }
  //__________________________get chart styling________________________________
  getchartstyling() {
    this.data.getchartstyling(this.APP_ID, this.PRCS_ID, this.SRC_ID).subscribe(
      res => {
        (res.json());
        var result = res.json();
        var name = result.PRF_NM;
        var value = result.PRF_VAL;
        this.V_PRF_NM = name;
        this.V_PRF_VAL = value;
        for (let i = 0; i < name.length; i++) {

          this.chartconfig[name[i]] = value[i];
        }

        this._backgroundColor = this.chartconfig['backgroundcolor'];
        this._borderColor = this.chartconfig['bordercolor'];
        this._fill = this.chartconfig['fill'];
        this._pointstyle = this.chartconfig['pointstyle'];
        this._linetension = this.chartconfig['linetension'];
        this._animations = this.chartconfig['animations'];
        this._pointradius = this.chartconfig['pointradius'];
        this._linestyle = this.chartconfig['linestyle'];
        this._fill.toString().toUpperCase() == "TRUE" ? this._fill = true : this._fill = false;
        this._linestyle == "dashed" ? this._borderdash = [5, 5] : this._borderdash = [];
        this.updatechart();
      }
    );
  }

  //_______________________________Set Chart Styling_________________________________
  setchartstyling() {
    this.chartconfig['backgroundcolor'] = this._backgroundColor;
    this.chartconfig['bordercolor'] = this._borderColor;
    this.chartconfig['fill'] = this._fill.toString().toLocaleUpperCase();
    this.chartconfig['pointstyle'] = this._pointstyle;
    this.chartconfig['linetension'] = this._linetension;
    this.chartconfig['animations'] = this._animations;
    this.chartconfig['pointradius'] = this._pointradius;
    this.chartconfig['linestyle'] = this._linestyle;

    this.V_PRF_NM = Object.keys(this.chartconfig);
    this.V_PRF_VAL = Object.values(this.chartconfig);
    //(this.V_PRF_NM);
    //(this.V_PRF_VAL);
    for (let j = 0; j < this.V_PRF_NM.length; j++) {
      this.data.setchartstyling(this.APP_ID, this.PRCS_ID, this.SRC_ID, this.V_PRF_NM[j], this.V_PRF_VAL[j]).subscribe(
        res => {
          //(res);
        });
    }
  }
  ngOnInit() {
    //this.price = await this.data.getPrice(this.currency);
    this.dispchart = true;
    this.disptable = true;
    this.getReportData();


    this.Table_of_Data3 = this.Table_of_Data2[0];


    this.Table_of_Data5 = JSON.parse(this.Table_of_Data1[0]);
    //(this.Table_of_Data5);
    var keyy = [];
    keyy = Object.keys(this.Table_of_Data5);
    var vals = [];
    vals = Object.values(this.Table_of_Data5);
    //(keyy);
    //(vals);

    for (let j = 0; j < vals.length; j++) {
      while (vals[j].indexOf(" ") != -1) {
        vals[j].splice(vals[j].indexOf(" "), 1, "----");
      }
      while (vals[j].indexOf("") != -1) {
        vals[j].splice(vals[j].indexOf(""), 1, "----");
      }
    }
    for (let i = 0; i < keyy.length; i++) {
      this.tabledata[keyy[i]] = vals[i];
    }
    //(vals);
    this.Table_of_Data5 = this.tabledata;
    //(this.Table_of_Data5);
    //(this.Table_of_Data5['PIID']);
    this.F1 = this.Table_of_Data5[this.columnsToDisplay[0]];
    let rowData1 = {};
    for (let i = 0; i < this.F1.length; i++) {
      let rowData = {};
      for (let j = 0; j < this.columnsToDisplay.length; j++) {

        let key = this.columnsToDisplay[j];
        rowData[key + ""] = this.Table_of_Data5[key + ""][i];
      }
      this.Table_of_Data4[i] = rowData;
      //(this.Table_of_Data4);
    }

    for (let j = 0; j <= this.columnsToDisplay.length; j++) {
      this.http.get<data>("https://" + this.domain_name + "/rest/E_DB/SP?FieldName=" + this.columnsToDisplay[j] + "&REST_Service=Field_Description&Verb=GET")
        .subscribe(res => {

          var name = res.Field_Name;
          var tip = res.Description_Text;
          var i;
          for (i = 0; i < tip.length; i++) {
            this.helpertext[name[i]] = tip[i];
          }
        })

    }
    this.getchartstyling();
  }

  ExecuteAgain() {
    this.Execute_Now();

  }
  Redirect_to_user() {
    //   var timezone = new Date();

    //   var Intermediatetimezone = timezone.toString()
    //   let body = {
    //     "V_USR_NM":this.V_USR_NM,
    //     "V_PRCS_TXN_ID":this.PRCS_TXN_ID,
    //     "V_SRC_ID":this.SRC_ID,
    //     "V_APP_ID":this.APP_ID,
    //     "V_PRCS_ID":this.PRCS_ID,
    //     "V_SRVC_ID":this.SRVC_ID,
    //     "V_RELEASE_RSN":"Cancelled Navigation "+this.SRVC_CD,
    //     "V_OPERATION":"MANUALDELETE",
    //     "TimeZone":Intermediatetimezone,
    //     "REST_Service":"Form_Report",
    //     "Verb":"PUT"
    //   };
    //   //(body);
    //    this.https.put("https://"+this.domain_name+"/rest/Process/Submit/FormSubmit", body).subscribe(
    //     res => {
    //       //(res);

    //  });
    this.route.navigateByUrl("End_User");
  }

  showhidecol(col) {

    if (this.columnsToDisplay.includes(col)) {
      var index = this.columnsToDisplay.indexOf(col);
      if (index > -1) {
        this.columnsToDisplay.splice(index, 1);
      }
    }
    //(this.columnsToDisplay);
  }
  //__________________________________________________________
  Execute_res_data: any[];
  progress: boolean = false;
  Execute_Now() {
    this.progress = true;
    let body = {
      "V_APP_CD": this.Exe_data['APP_CD'].toString(),
      "V_PRCS_CD": this.Exe_data['PRC_CD'].toString(),
      "V_SRVC_CD": 'START',
      "V_SRC_CD": this.V_SRC_CD,
      "V_USR_NM": this.V_USR_NM

    };

    this.https.post("https://" + this.domain_name + "/rest/Process/Report", body).subscribe(
      res => {

        //(res.json());
        this.Execute_res_data = res.json();
        //(this.Execute_res_data);

        this.GenerateReportTable();
      }
    );
  }
  GenerateReportTable() {
    //("in GenerateReportTable");

    //"&V_DSPLY_WAIT_SEC=100&V_MNL_WAIT_SEC=180&REST_Service=Report&Verb=GET
    let body = {
      V_SRC_ID: this.Execute_res_data['V_SRC_ID'],
      V_UNIQUE_ID: this.Execute_res_data['V_UNIQUE_ID'],
      V_APP_ID: this.Execute_res_data['V_APP_ID'],
      V_PRCS_ID: this.Execute_res_data['V_PRCS_ID'],
      V_PRCS_TXN_ID: this.Execute_res_data['V_PRCS_TXN_ID'],
      V_NAV_DIRECTION: this.Execute_res_data['V_NAV_DIRECTION'],
      V_DSPLY_WAIT_SEC: 100,
      V_MNL_WAIT_SEC: 180,
      REST_Service: 'Report',
      Verb: 'POST'
    }
    this.https.post(this.aptUrlPost_report, body)
      .subscribe(
        res => {
          //(res.json());
          this.dataStored.setCookies("report_table", res.json());

        }
      );
    this.progress = false;
    this.getReportData();
  }
  dialogOpen=false;
  dialogRef:any;
  ganttChart(){
    ("Gantt Chart");
    if(!this.dialogOpen){
      this.dialogOpen=true;
      this.dialogRef= this.dialog.open(DialogChartsComponent,{
        panelClass: 'custom-dialog-container',
        width:'60%',
        data:{Execute_res_data:{V_APP_ID:this.APP_ID,V_SRC_ID:this.SRC_ID,V_PRCS_ID:this.PRCS_ID,V_PRCS_TXN_ID:this.PRCS_TXN_ID}, type:'gantt'}
      });
      this.dialogRef.afterClosed().subscribe(result=>{
          this.dialogOpen=false;
      });
      
    }
    
  }

  barChart(){
    ("Bar Chart");
    if(!this.dialogOpen){
      this.dialogOpen=true;
      this.dialogRef= this.dialog.open(DialogChartsComponent,{
        panelClass: 'custom-dialog-container',
        width:'60%',
        data:{Execute_res_data:{V_APP_ID:this.APP_ID,V_SRC_ID:this.SRC_ID,V_PRCS_ID:this.PRCS_ID,V_PRCS_TXN_ID:this.PRCS_TXN_ID}, type:'bar'}
      });
      this.dialogRef.afterClosed().subscribe(result=>{
          this.dialogOpen=false;
      });
      
    }
  }

  pieChart(){
    ("Pie Chart");
    if(!this.dialogOpen){
      this.dialogOpen=true;
      this.dialogRef= this.dialog.open(DialogChartsComponent,{
        panelClass: 'custom-dialog-container',
        width:'60%',
        data:{Execute_res_data:{V_APP_ID:this.APP_ID,V_SRC_ID:this.SRC_ID,V_PRCS_ID:this.PRCS_ID,V_PRCS_TXN_ID:this.PRCS_TXN_ID}, type:'pie'}
      });
      this.dialogRef.afterClosed().subscribe(result=>{
          this.dialogOpen=false;
      });
      
    }
  }
  //currency = 'USD';
  //price: number;
}

export interface data {
  Field_Name: string[];
  Description_Text: string[];

}