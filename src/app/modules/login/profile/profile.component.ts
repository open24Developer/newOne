import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router'
import {Globals} from './../../../service/globals';
import {HttpClient} from '@angular/common/http';
import { StorageSessionService } from '../../../service/storage-session.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private router:Router,private StorageSessionService:StorageSessionService, private globals:Globals,
    public toastr: ToastrService,

    private http:HttpClient
  ) {


  }
  domain_name=this.globals.domain_name;
 options=[];
 optionSelected:string="";
 agency=this.StorageSessionService.getSession("agency");
 V_USR_NM=this.StorageSessionService.getSession("email");

chooworkingProfile(){
  this.http.get<data>("https://"+this.domain_name+"/rest/E_DB/SP?V_SRC_CD="+this.agency+"&V_USR_NM="+this.V_USR_NM+"&REST_Service=UserRoles&Verb=GET").subscribe(
      data=>{
        // (data);
       if(data.ROLE_CD){
           for(let i=0;i<data.ROLE_CD.length;i++){
               // (data.ROLE_CD[i]);
               if(data.ROLE_CD[i]=="Developer Role"){
                   this.options.push("Developer");
               }else if(data.ROLE_CD[i]=="End User Role"){
                   this.options.push("End_User");
               }else if(data.ROLE_CD[i]=='System Admin Role'){
                   this.options.push("System_Admin");
               }else if(data.ROLE_CD[i]=='Finance Role'){
                   this.options.push("Cost");
               }
               else if(data.ROLE_CD[i]=='IT Asset Role'){
                   this.options.push("Assets");
               }else if(data.ROLE_CD[i]=='User Admin Role'){
                   this.options.push("User_Admin");
               }

           }
       }

      //navigate when the lenght is 1
      // this.StorageSessionService.setLocatS("profileopt",this.options);
      if(this.options.length==1){
        // this.StorageSessionService.setLocatS("profileopt",this.options);

        this.toastr.info(this.options[0].toString(),"profile");
       this.router.navigateByUrl(this.options.pop(), {skipLocationChange: true});
      }
      this.StorageSessionService.setLocatS("profileopt",this.options);
    });
}

//Selected option in the profile section
optionSelecteds(e:any){
	//if(e.split(" ") > 0)
	 // this.toastr.info("your profile "+e+"profile");
	  this.router.navigateByUrl(e.replace(" ", "_"), {skipLocationChange: true});
	//this.router.navigateByUrl(e);
}
  ngOnInit() {
    this.chooworkingProfile();
    // let url:string="user";
    // this.router.navigateByUrl(url);
  }

}

export interface data{
  ROLE_CD:string[];
}
