import { ConfigServiceService } from './../../../service/config-service.service';
import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { StorageSessionService } from './../../../service/storage-session.service';
import { HostListener } from "@angular/core";
import {Globals} from './../../../service/globals';

@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.css']
})
export class PlatformComponent implements OnInit {

  V_SRC_CD: string = this.StorageSessionService.getSession("agency");
  V_USR_NM: string = this.StorageSessionService.getSession("email");
  screenHeight=0;
  screenWidth=0;
  mobileView=false;
  desktopView=true;
  @HostListener('window:resize', ['$event'])
    onResize(event?) {
      this.screenHeight = window.innerHeight;
      this.screenWidth = window.innerWidth;
      if(this.screenWidth<=767)
      {
        this.mobileView=true;
        this.desktopView=false;
      }else{
        this.mobileView=false;
        this.desktopView=true;
      }
  }
  constructor(private http: HttpClient,private globals:Globals,
    private StorageSessionService: StorageSessionService) {
      this.onResize();
      this.onpselect = function(index){
        this.selectedplat = index;
        }
     }

  domain_name=this.globals.domain_name; private apiUrlGet = "https://"+this.domain_name+"/rest/E_DB/SP?";
  private apiUrlPost = "https://"+this.domain_name+"/rest/E_DB/SP";
  private apiUrlPut = "https://"+this.domain_name+"/rest/E_DB/SP";
  private apiUrldelete = "https://"+this.domain_name+"/rest/E_DB/SP";

  plat:string[]=[];
  p_plat:string[]=[];
  p_desc:string[]=[];
  onpselect:Function;
  selectedplat:Number;
  progress:boolean;
  getPlatforms(){
    this.http.get<data>(this.apiUrlGet+"V_SRC_CD="+this.V_SRC_CD+"&V_CD_TYP=SERVER&REST_Service=Masters&Verb=GET").subscribe(
      res=>{
        this.plat=res.SERVER_CD;
      });
  }
  dataplat(){

  }
  getplatformdesc(p){
    this.http.get<data>(this.apiUrlGet+"V_CD_TYP=SERVER&V_CD="+p+"&V_SRC_CD="+this.V_SRC_CD+"&REST_Service=Description&Verb=GET").subscribe(
      res=>{
        this.p_plat=res.SERVER_CD;
        this.p_desc=res.SERVER_DSC;
      });
  }
  addplat(){
    let body={
      "V_SERVER_CD":this.p_plat,
      "V_SRC_CD":this.V_SRC_CD,
      "V_SERVER_DSC":this.p_desc,
      "REST_Service":"Platform_Master",
      "Verb":"PUT"
  };
  this.http.put(this.apiUrlPut,body).subscribe(
    res=>{
      (res);
      (body);
    });
  }
  deleteplat(){
  this.http.delete(this.apiUrlGet+"V_SERVER_CD="+this.p_plat+"&V_SRC_CD="+this.V_SRC_CD+"&REST_Service=Platform_Master&Verb=DELETE").subscribe(
    res=>{
      (res);
    });
  }
  ngOnInit() {
    this.getPlatforms();
  }
}
export interface data{
  SERVER_CD:string[];
  SERVER_DSC:string[];
}
