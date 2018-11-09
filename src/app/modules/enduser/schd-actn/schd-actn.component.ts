import { async } from '@angular/core/testing';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Globals } from './../../../service/globals';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers } from '@angular/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router'
import { data } from './schd_data';
import { MatTableDataSource, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';
import { AppComponent } from '../../../app.component';
import { HostListener } from "@angular/core";
import {
  MatPaginator, MatTable, MatTableModule, MatTabHeader,
  MatHeaderRow, MatHeaderCell, MatHeaderCellDef, MatHeaderRowDef,
  MatSortHeader, MatRow, MatRowDef, MatCell, MatCellDef
} from '@angular/material';
import { StorageSessionService } from '../../../service/storage-session.service';
import { ConfigServiceService } from '../../../service/config-service.service';
import { UseradminService } from '../../../service/useradmin.service';

@Component({
  selector: 'app-schd-actn',
  templateUrl: './schd-actn.component.html',
  styleUrls: ['./schd-actn.component.css'],

})

export class SchdActnComponent implements OnInit, AfterViewInit {
  onpselect: Function;
  screenHeight = 0;
  screenWidth = 0;
  mobileView = false;
  desktopView = true;
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 767) {
      this.mobileView = true;
      this.desktopView = false;
    } else {
      this.mobileView = false;
      this.desktopView = true;
    }
  }
  constructor(private Router: Router,
    private http: HttpClient,
    private globals: Globals,
    public app: AppComponent,
    private https: Http,
    private _http: HttpClient,
    private data2: UseradminService,
    private StorageSessionService: StorageSessionService,
    private data: ConfigServiceService,
    private detector: ChangeDetectorRef) {
    this.onpselect = function (index) {
      this.selectedrole = index;
    }
    this.onResize();
  }
  domain_name = this.globals.domain_name; private apiUrlGet = "https://" + this.domain_name + "/rest/E_DB/SP?";
  //____________________________________CLOSE SESSION_________________________________
  //_____________________________________VARIABLE
  App_CD_data = [];
  proc_CD_data = [];
  ser_cd_data = [];
  V_SRC_CD: string = this.StorageSessionService.getSession("agency");
  V_USR_NM: string = this.StorageSessionService.getSession("email");
  ApplicationCD = "";
  ProcessCD = "";
  StatusCD = "";
  innerTable: data;
  data1: any;
  form_dl_data: any[] = [];
  innerTableDT: any[] = [];
  F1: any[];

  process_box: boolean = false;
  action_box: boolean = false;

  Label: any[] = [];

  // save_shedule_btn: boolean = true;
  FormData: any = [];
  ParametrValue: any[] = [];
  ParameterName: any[] = [];
  Data: any[] = [];
  tp = {};
  kl = 0;
  displayedColumns = ['#', 'name', 'status', 'lastrun', 'nextrun', 'details'];
  dataSource = new MatTableDataSource();
  Action: any = [];
  getAppCode() {
    this.https.get(this.apiUrlGet + "V_CD_TYP=APP&V_SRC_CD=" + this.V_SRC_CD + "&SCREEN=PROFILE&REST_Service=Masters&Verb=GET").subscribe(
      res => {
        this.App_CD_data = res.json();
        console.log(res);
        if (this.app.START == false && this.ApplicationCD.length > 0 && this.app.selected_APPLICATION != 'ALL')
          if (this.mobileView)
            this.getProcessCD({ value: this.ApplicationCD });
          else
            this.getProcessCD(this.ApplicationCD);
      });
  }
  getProcessCD(u) {
    if (this.mobileView)
      u = u.value;
    this.ApplicationCD = u;
    this.app.selected_APPLICATION = u;
    this.selectedplat = u;
    this.selectedplat1 = null;
    this.selectedplat2 = null;
    this.Action = [];
    this.innerTableDT = [];
    this.Data = [];
    this.https.get(this.apiUrlGet + "V_APP_CD=" + u + "&V_SRC_CD=" + this.V_SRC_CD + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=AppProcesses&Verb=GET")
      .subscribe(res => { this.proc_CD_data = res.json(); });
    //enable the scheduler btn 
    // this.find_process(u, this.ProcessCD, "All");
    this.process_box = true;
    if (this.app.START == false && this.ProcessCD.length > 0 && this.app.selected_PROCESS != 'ALL')
      if (this.mobileView)
        this.fooo1({ value: this.ProcessCD });
      else
        this.fooo1(this.ProcessCD);

  }
  //_________________________________FIND PROCESS__________________________________________
  table = "";
  Table_scheduled_data: any[] = [];
  Table_paused_data: any[] = [];
  Table_kill_data: any[] = [];

  find_process(ApplicationCD, ProcessCD, StatusCD) {

    this.Action = [];
    this.innerTableDT = [];
    this.Data = [];
    this.http.get<data>(this.apiUrlGet + "V_SRC_CD=" + this.V_SRC_CD + "&V_APP_CD=" + ApplicationCD + "&V_PRCS_CD=" + ProcessCD + "&V_USR_NM=" + this.V_USR_NM + "&V_TRIGGER_STATE=" + StatusCD + "&REST_Service=ScheduledJobs&Verb=GET").subscribe(data => {
      let rm_f: boolean;
      let ps_r: boolean;

      console.log(data);

      this.F1 = data.SRVC_CD;
      console.log(this.F1);
      console.log(this.F1.length);
      for (let i = 0; i < this.F1.length; i++) {
        this.innerTableDT[i] = {
          name: data.SRVC_CD[i],
          status: data.TRIGGER_STATE[i],
          lastrun: data.PREV_FIRE_TIME[i],
          nextrun: data.NEXT_FIRE_TIME[i],
          details: data.DESCRIPTION[i],
          job_name: data.JOB_NAME[i]

        }

        //_______check trigger status 
        if (data.TRIGGER_STATE[i] == "SCHEDULED") {
          ps_r = true;
        } if (data.TRIGGER_STATE[i] == "PAUSED") {
          rm_f = true;
        }
      }
      //push dependent flag
      this.Action.push("Setup a New Schedule");
      if (rm_f) {
        this.Action.push("Resume Existing Schedule");
      } if (ps_r) {
        this.Action.push("Pause Existing Schedules");

      }
      //    push kill flag if process are not empty
      if (data.TRIGGER_STATE.length > 0) {
        this.Action.push("Kill Existing Schedule");
      }
      this.dataSource.data = this.innerTableDT;
    });

  }
  selection = new SelectionModel<data>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */

  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   this.data1 = this.selection.selected;
  //   console.log(this.data1);
  //   const numRows = this.dataSource.data.length;
  //   return numSelected === numRows;

  // }
  //_____________________________________CLOSE____________________________________________

  //-------------get process id / JOB_NAME
  Process_key: any = [];
  Check_process_id(key: any) {
    this.Process_key.push(key);
    console.log(this.Process_key);
    this.Process_key.forEach(function (v, i) {
      console.log("v" + v);
      console.log("i" + i);
      console.log(key);
      if (v == key) {
        //     var index = this.Process_key.indexOf(v);

        // if (index > -1) {
        this.Process_key.splice(i, 1);
        //}
        //this.Process_key = this.Process_key.filter(function(e) { return e !== v })
        //this.Process_key.slice(i);
      }
    });
    console.log(this.Process_key);

    //console.log("Array lenght"+this.Process_key.length+" elm"+this.Process_key);
  }
  onRowClick(row) {
    console.log('Row clicked: ', row);
  }


  Process_operation(P_ID: any, P_OP: any) {

    let body = {
      "TriggerKey": [P_ID],
      "JobKey": [P_ID],
      "Operation": [P_OP]
    };
    console.log(body);
    this.https.post("https://" + this.domain_name + "/rest/Hold/ScheduleAction", body).subscribe(
      res => {
        console.log(res.json());

      }
    );

    //this.find_process(this.ApplicationCD,this.ProcessCD,"All");
  }


  onPause() {

    this.innerTableDT = [];
    console.log('PAUSE!!!');
    //Pause
    for (let i = 0; i < this.Process_key.length; i++) {
      this.Process_operation(this.Process_key[i], "Pause");
    }
    setTimeout(() => {
      this.find_process(this.ApplicationCD, this.ProcessCD, "All");
    }, 5000);

  }


  onResume() {
    this.innerTableDT = [];
    console.log('RESUME!!!');
    //Resume
    for (let i = 0; i < this.Process_key.length; i++) {
      this.Process_operation(this.Process_key[i], "Resume");
    }
    //await delay(2000);
    setTimeout(() => {
      this.find_process(this.ApplicationCD, this.ProcessCD, "All");
    }, 5000);
    //this.find_process(this.ApplicationCD,this.ProcessCD,"All");	
  }

  onKill() {
    this.innerTableDT = [];
    //Kill
    console.log('KILL!!!');
    for (let i = 0; i < this.Process_key.length; i++) {
      this.Process_operation(this.Process_key[i], "Kill");
      console.log("Process id" + this.Process_key[i]);
    }
    setTimeout(() => {
      this.find_process(this.ApplicationCD, this.ProcessCD, "All");
    }, 5000);
  }

  Roll_cd: any[] = [];

  ngOnInit() {
    if (this.app.selected_APPLICATION != 'ALL' && !this.app.START)
      this.ApplicationCD = this.app.selected_APPLICATION;
    if (this.app.selected_PROCESS != 'ALL' && !this.app.START)
      this.ProcessCD = this.app.selected_PROCESS;
    this.data2.getJSON().subscribe(data2 => {

      this.Label = data2.json();

    })

    this.getAppCode();
    this.data.getJSON().subscribe(data => { console.log(data.json()); this.Label = data.json(); console.log(this.Label); })

  }
  selectedplat: any;
  selectedplat1: any;
  selectedplat2: any;
  display_dynamic_paramter: boolean = false;
  ref:any= {};
  display_process_table: boolean = false;
  display_matcard: boolean = false;
  Resume_btn: boolean = false;
  Kill_btn: boolean = false;
  Pause_btn: boolean = false;
  Save_btn: boolean = false;
  show_filter_input: boolean = false;
  checkbox_color_value = "";
  fooo1(u) {
    if (this.mobileView)
      u = u.value;
    this.selectedplat2 = null;
    this.ProcessCD = u;
    this.selectedplat1 = u;
    this.Action = [];
    this.innerTableDT = [];
    this.Data = [];
    this.action_box = true;

    this.find_process(this.ApplicationCD, this.ProcessCD, "All");
  }
  fooo2(u) {
    if (this.mobileView)
      u = u.value;
    this.display_matcard = true;
    this.form_dl_data[0] = {
      APP_CD: this.ApplicationCD,
      PRC_CD: this.ProcessCD
    }


    console.log(this.form_dl_data);
    this.StorageSessionService.setSession("Exe_data", this.form_dl_data[0]);

    this.selectedplat2 = u;
    if (u == "Setup a New Schedule") {
      this.display_process_table = false;

      this.innerTableDT = [];
      this.Resume_btn = false;
      this.Kill_btn = false;
      this.Pause_btn = false;
      this.Save_btn = true;
      this.Process_key = [];
      this.show_btn_save_schedule();
    } else if (u == "Pause Existing Schedules") {
      //this.onPause(); //Paused
      //	this.innerTableDT=[];
      this.display_dynamic_paramter = false;
      this.display_process_table = true;
      this.Resume_btn = false;
      this.Kill_btn = false;
      this.Pause_btn = true;
      this.Save_btn = false;
      this.Process_key = [];
      this.show_filter_input = false;
      this.checkbox_color_value = "checkbox_blue";
      this.applyFilter("SCHEDULED");
      this.find_process(this.ApplicationCD, this.ProcessCD, "Scheduled");
    } else if (u == "Resume Existing Schedule") {
      //	this.innerTableDT=[];
      this.display_dynamic_paramter = false;
      this.display_process_table = true;
      this.Resume_btn = true;
      this.Kill_btn = false;
      this.Pause_btn = false;
      this.Save_btn = false;
      this.Process_key = [];
      this.show_filter_input = false;
      this.checkbox_color_value = "checkbox_green";
      this.applyFilter("PAUSED");
      //When Click on "Resume Existing Schedule" Call all "Paused" Schedule and list if only Paused Schedules 
      this.find_process(this.ApplicationCD, this.ProcessCD, "Paused");
    } else if (u == "Kill Existing Schedule") {
      //	this.innerTableDT=[];
      this.display_dynamic_paramter = false;
      this.display_process_table = true;
      this.Resume_btn = false;
      this.Kill_btn = true;
      this.Pause_btn = false;
      this.Save_btn = false;
      this.Process_key = [];
      this.show_filter_input = true;
      this.checkbox_color_value = "checkbox_red";
      this.applyFilter("");
      this.find_process(this.ApplicationCD, this.ProcessCD, "All");
    }
  }
  // enable_btn() {
  //   this.repeat_btn = false;
  // }
  //---------------navigate to scheduler repeat after page

  // repeat_btn: boolean = true;
  repeatURL() {

    this.form_dl_data[0] = {
      APP_CD: this.ApplicationCD,
      PRC_CD: this.ProcessCD
    }


    console.log(this.form_dl_data);
    this.StorageSessionService.setSession("Exe_data", this.form_dl_data[0]);
    this.Router.navigateByUrl("repeat");


  }

  //---------------------------------
  show_btn_save_schedule() {
    //--------------Reuse from ConfigService: ABHISHEK ABHINAV----------------//
    this.https.get(this.apiUrlGet + "V_APP_CD=" + this.ApplicationCD + "&V_PRCS_CD=" + this.ProcessCD + "&V_SRC_CD=" + this.V_SRC_CD + "&ResetOptimised=" + false + "&Lazyload=" + false + "&REST_Service=ProcessParameters&Verb=GET").subscribe(
      res => {
        var FormData= res.json();
        this.ref={disp_dyn_param:false};
        var got_res = this.data.exec_schd_restCall(FormData,this.ref);
        this.Data= got_res.Data;
        this.kl= got_res.K;
    /*this.https.get(this.apiUrlGet + "V_APP_CD=" + this.ApplicationCD + "&V_PRCS_CD=" + this.ProcessCD + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=ProcessParameters&Verb=GET").subscribe(
      res => {
        console.log(this.apiUrlGet + "V_APP_CD=" + this.ApplicationCD + "&V_PRCS_CD=" + this.ProcessCD + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=ProcessParameters&Verb=GET");
        console.log(res.json());
        this.FormData = res.json();
        this.ParametrValue = this.FormData['PARAM_VAL'];
        this.ParameterName = this.FormData['PARAM_NM'];
        let arr: string;

        for (let i = 0; i < this.ParametrValue.length; i++) {
          if (this.ParameterName[i].includes('Date') && !(this.ParameterName[i].includes('DateTime'))) {
            this.Data[i] = {
              type: 'date',
              name: this.ParameterName[i],
              value: this.ParametrValue[i],
              placeholder: this.ParameterName[i].split('_').join(' '),

            };

          }
          else if (this.ParameterName[i].charAt(0) == '?') {
            this.Data[i] = {
              type: 'radio',
              name: this.ParameterName[i],
              value: this.ParametrValue[i],
              placeholder: this.ParameterName[i].split('_').join(' '),
            };
          }
          else if (this.ParameterName[i].charAt(this.ParameterName[i].length - 1) == '?') {
            this.Data[i] = {
              type: 'checkbox',
              name: this.ParameterName[i],
              value: this.ParametrValue[i],
              placeholder: this.ParameterName[i].split('_').join(' '),
            };
          }
          else if (this.ParameterName[i].includes('Time') && !(this.ParameterName[i].includes('DateTime'))) {
            this.Data[i] = {
              type: 'time',
              name: this.ParameterName[i],
              value: this.ParametrValue[i],
              placeholder: this.ParameterName[i].split('_').join(' '),
            };
          }
          else if (this.ParameterName[i].includes('DateTime')) {
            this.Data[i] = {
              type: 'datetime',
              name: this.ParameterName[i],
              value: this.ParametrValue[i],
              placeholder: this.ParameterName[i].split('_').join(' '),
            };
          }
          else if (this.ParameterName[i].includes('Password')) {
            this.Data[i] = {
              type: 'password',
              name: this.ParameterName[i],
              value: this.ParametrValue[i],
              placeholder: this.ParameterName[i].split('_').join(' '),
            };
          }
          else if (this.ParameterName[i].includes('Range')) {
            this.Data[i] = {
              type: 'range',
              name: this.ParameterName[i],
              value: this.ParametrValue[i],
              placeholder: this.ParameterName[i].split('_').join(' '),
            };
          }
          else if (this.ParameterName[i].includes('Color')) {
            this.Data[i] = {
              type: 'color',
              name: this.ParameterName[i],
              value: this.ParametrValue[i],
              placeholder: this.ParameterName[i].split('_').join(' '),
            };
          }
          else {
            this.Data[i] = {
              type: 'input',
              name: this.ParameterName[i],
              value: this.ParametrValue[i],
              placeholder: this.ParameterName[i].split('_').join(' '),

            };
          }

          if (this.ParametrValue.length > 0)
            this.display_dynamic_paramter = true;
          this.kl = i;
        }*/

        
        for (let i = 0; i <= this.kl; i++) {
          
          if (this.Data[i].value != "" && this.Data[i].value != null) {
            this.tp[this.Data[i].name] = this.Data[i].value;
          }
        }
        console.log(this.tp);


      }
    );
    // this.save_shedule_btn = false;
  }

  FilterAutoValue: any;
  Update_value(v: any, n) { //v=value and n=paramter name
    this.FilterAutoValue = v;
    let ag = this.StorageSessionService.getSession('agency');
    let ur = this.StorageSessionService.getSession('email');
    this.http.get("https://" + this.domain_name + "/rest/E_DB/SP?V_APP_CD=" + this.ApplicationCD + "&V_PRCS_CD=" + this.ProcessCD + "&V_SRC_CD=" + ag + "&V_USR_NM=" + ur + "&V_PARAM_NM=" + n + "&V_PARAM_VAL=" + v + "&REST_Service=ProcessParameters&Verb=PATCH").subscribe(
      res => {

      }
    );
  }
  searchResult: any[] = [];
  filteredOptions: Observable<string[]>;
  getDropDownListValue(e) {
    //this.app.loading=true;
    this.searchResult = [];
    this.http.get(this.apiUrlGet + "V_SRC_CD=" + this.V_SRC_CD + "&V_APP_CD=" + this.ApplicationCD + "&V_PRCS_CD=" + this.ProcessCD + "&V_PARAM_NM=" + e + "&V_SRVC_CD=Pull%20FPDS%20Contracts&REST_Service=ProcessParametersOptions&Verb=GET")
      .subscribe(
        res => {
          console.log(res[e]);
          this.searchResult = res[e];
          // this.app.loading = false;
        }
      );


  }


  //---------------------------
  ngAfterViewInit() {
    // TODO: Remove this as it is a workaround to make the table visible when the page got reloaded
    this.detector.detectChanges();
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  add(aa) {
    console.log(aa.name + aa.value);
    if (aa.name in this.tp) { this.tp[aa.name] = aa.value; }
    else {
      this.tp[aa.name] = aa.value;
    }
    console.log(this.tp);
    this.StorageSessionService.setCookies("tp", this.tp);
  }
}
export interface PeriodicElement {
  name: any;
  status: any;
  lastrun: any;
  nextrun: any;
  details: any;
  job_name: any;
}

export interface data {
  APP_CD: string;
  PRCS_CD: string;
  ser_cd_data: string[];

  // ======================find process
  CREATE: string[];
  CRON_EXPRESSION: string[];
  DELETE: string[];
  DESCRIPTION: string[];
  EXECUTE: string[];
  JOB_NAME: string[];
  NEXT_FIRE_TIME: string[];
  PREV_FIRE_TIME: string[];
  READ: string[];
  SRVC_CD: string[];
  TRIGGER_STATE: string[];
  UPDATE: string[];

  // ==================================
}




