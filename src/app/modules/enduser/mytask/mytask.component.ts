import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import {Globals} from './../../../service/globals';
import { MatCardModule } from '@angular/material/card';
// import { DataSource } from '@angular/cdk/table';
// import { Observable } from 'rxjs/Observable';
// import { CdkTableModule } from '@angular/cdk/table';
// import { forEach } from '@angular/router/src/utils/collection';
// import {
//   MatPaginator, MatSort, MatTable, MatTableModule, MatTabHeader,
//   MatHeaderRow, MatHeaderCell, MatHeaderCellDef, MatHeaderRowDef,
//   MatSortHeader, MatRow, MatRowDef, MatCell, MatCellDef
// } from '@angular/material';
// import 'rxjs/add/observable/of';
// import { MatTableDataSource } from '@angular/material';
import { AppComponent } from '../../../app.component';
import { StorageSessionService } from '../../../service/storage-session.service';
import { UseradminService } from '../../../service/useradmin.service';


@Component({
  selector: 'app-mytask',
  templateUrl: './mytask.component.html',
  styleUrls: ['./mytask.component.css']
})
export class MytaskComponent implements OnInit {

  // innerTableDT: any[] = [];
  // F1: any[];
  // rowData={};
  // displayedColumns = ['Name', 'Values'];
  // dataSource = new MatTableDataSource();


  V_SRC_CD: string = this.StorageSessionService.getSession("agency");
  V_USR_NM: string = this.StorageSessionService.getSession("email");
  V_BASE_ID: string[] = null;

  constructor(private http: HttpClient,private router:Router,
    private data:UseradminService,
     private app: AppComponent,private globals:Globals,
    private StorageSessionService: StorageSessionService) { 
      this.onpselect = function(index){
        this.selectedplat = index;
        this.selectedot=null;
        this.selectedat=null;
        }
        this.onqselect = function(index){
          this.selectedot = index;
          this.selectedat=null;
          }
          this.onrselect = function(index){
            this.selectedat = index;
            this.selectedot=null;
            }
    }

  domain_name=this.globals.domain_name; private apiUrlGet = "https://"+this.domain_name+"/rest/E_DB/SP?";
  private apiUrlPost = "https://"+this.domain_name+"/rest/Hold/MyTask";
  atxnid: string[];
  srvcd: string[];
  otxnid: string[];
  servicedetails: string[];
  groups: string[];
  holdreason: string[];
  notes: string[];
  selectedradiobtn: string = "Approve";
  //txnid_sl = "";
  agency_sl = "";
  servs: string;
  array: string[];
  array1: string[];
  array2: string[][] = [];
  hldrsnedit: string;
  notesedit: string;
  searchResult: any[];
  disabled: boolean;
  onpselect:Function;
  onqselect:Function;
  onrselect:Function;
  selectedservc:Number;
  selectedat:Number;
  selectedot:Number;
  Label:any[]=[];


  // ----------- get services ------------

  functionsrvcGetData() {


    this.http.get<data>(this.apiUrlGet + "V_SRC_CD=" + this.V_SRC_CD + "&V_USR_NM=" + this.V_USR_NM + "&SCREEN=USR_ACTN&REST_Service=HeldService&Verb=GET").subscribe(
      res => {
        (res.SRVC_CD);
        this.srvcd = res.SRVC_CD.sort(function (a, b) { return a.localeCompare(b); });
      }
    );
  }


  // ----------  get Acquired Transactions ------------

  functionATIDGetData(exc_sl) {
    if (exc_sl == "") {
      this.groups = null;
      this.otxnid = null;
      this.atxnid = null;

      this.agency_sl = "";
    }
    this.http.get<data>(this.apiUrlGet + "V_SRVC_CD=" + exc_sl + "&V_USR_NM=" + this.V_USR_NM + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=AcquiredTasks&Verb=GET").subscribe(
      res => {

        this.atxnid = res.TXN_ID;

      }
    );
  }
  // ----------  get Open Transactions ------------
  functionOTIDGetData(exc_sl) {
    if (exc_sl == "") {
      this.groups = null;
      this.otxnid = null;
      this.atxnid = null;

      this.agency_sl = "";
    }
    this.http.get<data>(this.apiUrlGet + "V_SRVC_CD=" + exc_sl + "&V_USR_NM=" + this.V_USR_NM + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=OpenTasks&Verb=GET").subscribe(
      res => {

        this.otxnid = res.TXN_ID;
      }
    );
  }
  // ----------  get open ids Details ------------

  functionopendetails(txnid_sl) {
    this.array1 = null;
    this.disabled = true;
    this.http.get<data>(this.apiUrlGet + "V_TXN_ID=" + txnid_sl + "&V_USR_NM=" + this.V_USR_NM + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=OpenTaskDetail&Verb=GET").subscribe(
      res => {
        (res.PVP);
        this.servicedetails = res.PVP;
        this.holdreason = res.HOLD_RSN;
        this.notes = res.RELEASE_RSN;
        (this.holdreason);
        (this.notes);
        this.V_BASE_ID = res.BASE_ID;
        this.servs = this.servicedetails[0];
        this.array = this.servs.split(",");
        this.array[0] = this.array[0].substr(1);
        let l = this.array.length;
        l = l - 1;
        this.array[l] = this.array[l].slice(0, -1);
        for (let i in this.array) {
          this.array1 = this.array[i].split("=");
          this.array2.push(this.array1);
          this.array1 = [];
        }
        //  for (let i in this.array2) {
        //   this.innerTableDT[i]={
        //     Name: this.array2[i][0],
        //     Values:this.array2[i][1]
        //   }
        //   this.dataSource.data=this.innerTableDT;
        //      (this.array2);

        // }
      }
    );
  }

  functionacquireddetails(txnid_sl) {
    this.array1 = null;
    this.disabled = false;
    this.http.get<data>(this.apiUrlGet + "V_TXN_ID=" + txnid_sl + "&V_USR_NM=" + this.V_USR_NM + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=TaskDetail&Verb=GET").subscribe(
      res => {
        (res.PVP);
        this.servicedetails = res.PVP;
        this.holdreason = res.HOLD_RSN;
        this.notes = res.RELEASE_RSN;
        (this.holdreason);
        (this.notes);
        this.V_BASE_ID = res.BASE_ID;
        this.servs = this.servicedetails[0];
        this.array = this.servs.split(",");
        this.array[0] = this.array[0].substr(1);
        let l = this.array.length;
        l = l - 1;
        this.array[l] = this.array[l].slice(0, -1);
        for (let i in this.array) {
          this.array1 = this.array[i].split("=");
          this.array2.push(this.array1);

          this.array1 = [];
        }
        //  this.array2.push(["Type of Set Aside","20 30 40"]);
        //  for (let i in this.array2) {
        //   this.innerTableDT[i]={
        //     Name: this.array2[i][0],
        //     Values:this.array2[i][1]
        //   }
        //   this.dataSource.data=this.innerTableDT;
        //      (this.array2);

        // }
      }
    );

  }

  // -------------for getting dropdown values of parameter -----------

  getDropDownListValue(e) {
    this.app.loading = true;
    this.searchResult = [];
    this.http.get("https://"+this.domain_name+"/rest/E_DB/SP?V_SRC_CD=AWS1&V_APP_CD=Federal%20Contracts&V_PRCS_CD=Federal%20Opportunities&V_PARAM_NM=Type%20of%20Set%20Aside&V_SRVC_CD=Pull%20FPDS%20Contracts&REST_Service=ProcessParametersOptions&Verb=GET")
      .subscribe(
        res => {
          (res[e]);
          this.searchResult = res[e];
          this.app.loading = false;
        }
      );

  }
  /*  Update_value(v,n){ 
      let ag=this.StorageSessionService.getSession('agency');
      let ur=this.StorageSessionService.getSession('email');
      this.apiUrlGet+"V_TXN_ID="+this.txnid_sl+"&V_USR_NM="+this.V_USR_NM+"&V_SRC_CD="+this.V_SRC_CD+"&REST_Service=TaskDetail&Verb=GET"
          this.http.get("https://"+this.domain_name+"/rest/E_DB/SP?V_SRC_CD=AWS1&V_APP_CD=Federal%20Contracts&V_PRCS_CD=Federal%20Opportunities&V_PARAM_NM=Type%20of%20Set%20Aside&V_SRVC_CD=Pull%20FPDS%20Contracts&REST_Service=ProcessParametersOptions&Verb=GET").subscribe(
            res=>{
             
            }
          );
    } */


  // -------------for getting groups ---------------
  functiongetgroups() {
    this.http.get<data>(this.apiUrlGet + "V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=Groups&Verb=GET").subscribe(
      res => {
        (res.USR_GRP_CD);
        this.groups = res.USR_GRP_CD.sort(function (a, b) { return a.localeCompare(b); });
      }
    );

  }
  // ----------  Acquire button functionality ------------

  toAcquire() {
    let body = {
      "V_USR_NM": this.V_USR_NM,
      "V_BASE_ID": this.V_BASE_ID,
      "V_SRC_CD": this.V_SRC_CD,
      "V_RELEASE_RSN": this.notes,
      "RESULT": "@RESULT",
      "V_OPERATION": "ACQUIRED"
    };
    this.http.post(this.apiUrlPost, body).subscribe(
      res => {
        (res);
      }
    );
    this.detailshow = false;
    this.atxnid = null;

    //this.txnid_sl = null;
    this.operationshow = false;

  } 

  // ---------- To Release --------------

  toRelease() {
    var V_PVP_PARAM_NM = [];
    var V_PVP_PARAM_VAL = [];
    var V_PVP = [];

    var PVP = null;
    if (this.array2.length > 0) {
      for (var i = 0; i < this.array2.length; i++) {

        if (i % 2 == 0) {
          V_PVP_PARAM_NM.push(this.array2[i]);
        }

        {
          V_PVP_PARAM_VAL.push(this.array2[i]);
        }
      }


      for (var j = 0; j < V_PVP_PARAM_NM.length; j++) {
        V_PVP[j] = V_PVP_PARAM_NM[j] + "=" + V_PVP_PARAM_VAL[j];
      }

      PVP = "{" + V_PVP + "}";

    }
    if (this.selectedradiobtn.toString() == "Release") {

      ("---------" + PVP + "----------");
      (this.hldrsnedit);
      (this.notesedit);
    }
    // let body={
    //   "V_USR_NM":this.V_USR_NM,
    //   "V_BASE_ID":this.V_BASE_ID,
    //   "V_SRC_CD":this.V_SRC_CD,  
    //   "V_PVP":"",
    //   "V_RELEASE_RSN":this.notes,
    //   "RESULT":"@RESULT",
    //   "V_OPERATION":"RELEASED",
    //   "TASK":"USER"
    // };
    //     this.http.post(this.apiUrlPost , body).subscribe(
    //       res=>{
    //         (res);

    //       }
    //     );
  }
  // ---------- show or hide buttons and form ------------

  agcygrpbox: boolean = false;
  detailshow: boolean = false;
  acquirebtnshow: boolean = false;
  operationshow: boolean = false;
  functiondetailshow() {
    this.detailshow = true;
  }
  functionoperations() {
    this.operationshow = true;
    this.acquirebtnshow = false;
  }
  hideagcygrpbox() {
    this.agcygrpbox = false;
  }
  showagcygrpbox() {
    this.agcygrpbox = true;
  }
  functionacqire() {
    this.acquirebtnshow = true;
    this.agcygrpbox = false;
    this.operationshow = false;

  }

  // ------------------ 

  ngOnInit() {
    this.functionsrvcGetData();
    this.data.getJSON().subscribe(data => {       (data.json());       this.Label=data.json();       (this.Label);   })
  }
}
export interface data {
  SRVC_CD: string[];
  TXN_ID: string[];
  PVP: string[];
  USR_GRP_CD: string[];
  HOLD_RSN: string[];
  RELEASE_RSN: string[];
  BASE_ID: string[];

}