import { Component, OnInit, Input, forwardRef } from '@angular/core';
//import { GetFormData } from '../getDataForm';
import { StorageSessionService } from '../../../../service/storage-session.service';

import { EndUserService } from '../../../../service/EndUser-service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Globals } from '../../../../service/globals';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormComponent } from '../form/form.component';
import { AppComponent } from '../../../../app.component';
import * as dateFormat from 'dateformat';
import { CommonUtils } from '../../../../common/utils';

@Component({
  selector: 'app-repeatable-form',
  templateUrl: './repeatable-form.component.html',
  styleUrls: ['./repeatable-form.component.css']
})
export class RepeatableFormComponent extends FormComponent implements OnInit {
  // domain_name = this.globals.domain_name;
  //  private apiUrlGet = "https://" + this.domain_name + "/rest/E_DB/SP?";
  //formData: GetFormData;
  public form: FormGroup;
  input: any[][] = [];
  rows = [0];
  totalRow = 1;
  edit_or_done: string[] = ["edit"];
  isDisabled: boolean[] = [true];
  ctrl_variables: Object;
  phoneDash_arr: Array<any> = [];
  plainInput_arr: Array<any> = [];
  dateEntry_arr: Array<any> = [];
  deleted: boolean[] = [false];
  currentDate: any;
  PVP_Updated: any = {};

  constructor(
    public StorageSessionService: StorageSessionService,
    public http: HttpClient,
    public router: Router,
    public globals: Globals,
    public app: AppComponent
  ) {
    super(StorageSessionService, http, router, globals, app);
  }

  addForm(form): void {
    console.log('add form call');
    var Field_Names = '';
    var Field_Values = "";
    var key_array = Object.keys(form)
    for (let i = 0; i < key_array.length; i++) {
      if (i != 0) {
        Field_Names += '|';
        Field_Values += '|';
      }
      Field_Names += "\"" + key_array[i] + "\"";
      Field_Values += "\"" + form[key_array[i]] + "\"";
    }

    Field_Names += '|\"V_abcd\"';
    Field_Values += '|\"\"';
    let body_FORMrec = {
      "Field_Names": Field_Names,
      "Field_Values": Field_Values,
      "V_Table_Name": this.V_TABLE_NAME,
      "V_Schema_Name": this.V_SCHEMA_NAME,
      "V_Key_Names": this.V_KEY_NAME,
      "V_Key_Values": this.V_KEY_VALUE,
      "V_SRVC_CD": this.V_SRVC_CD,
      "V_USR_NM": this.V_USR_NM,
      "V_SRC_CD": this.V_SRC_CD,
      "V_PRCS_ID": this.V_PRCS_ID,
      "REST_Service": "Forms_Record",
      "Verb": "POST"
    }
    console.log(body_FORMrec);
    /*this.http.post(this.apiUrlGet, body_FORMrec).subscribe(
      res => {
        console.log("Response:\n" + res);
      });*/
  }

  updateForm(form): void {
    console.log('update form call');

    var Field_Names_Ar = [];
    var Field_Values_Ar = [];
    var key_array = Object.keys(form);
    for (const field_name in form) {
      if (form.hasOwnProperty(field_name) && field_name !== "iteration") {
        Field_Names_Ar.push("\"" + field_name + "\"");
        Field_Values_Ar.push("\"" + form[field_name] + "\"");
      }
    }

    const Field_Names = Field_Names_Ar.join("|");
    const Field_Values = Field_Values_Ar.join("|");

    let body_req = {
      "V_Table_Name": this.V_TABLE_NAME,
      "V_Schema_Name": this.V_SCHEMA_NAME,
      "V_SRVC_CD": this.V_SRVC_CD,
      "V_USR_NM": this.V_USR_NM,
      "V_SRC_CD": this.V_SRC_CD,
      "V_PRCS_ID": this.V_PRCS_ID,
    }

    if (Field_Names !== this.Field_Names_initial) {
      body_req["Field_Names"] = Field_Names;
    }
    if (Field_Values !== this.Field_Values_initial) {
      body_req["Field_Values"] = Field_Values;
    }
    body_req["Verb"] = "POST";
    let httpMethod = this.http.post.bind(this.http);
    if (CommonUtils.isValidValue(this.V_ID) && CommonUtils.isValidValue(this.V_ID[form["iteration"] - 1])) {
      body_req["V_ID"] = this.V_ID[form["iteration"] - 1];
      body_req["Verb"] = "PATCH";
      httpMethod = this.http.put.bind(this.http);
    }
    body_req["REST_Service"] = "Forms_Record";

    //console.log(body_FORMrec);
    console.log(body_req);
    //this.http.put(this.apiUrlGet, body_FORMrec).subscribe(
    httpMethod(this.apiUrlGet, body_req).subscribe(
      res => {
        console.log("Response:\n" + res);
      }),
      err => {
        console.error("failure response recieved in post");
        console.error(err);
      }
  }

  deleteForm(form): void {
    console.log('delete form call');
    console.log(form["iteration"]);

    var del_URL = "https://" + this.domain_name + "/rest/E_DB/SP?V_Table_Name=" + this.V_TABLE_NAME + "&V_Schema_Name=" + this.V_SCHEMA_NAME + "&V_ID=" + this.V_ID[form["iteration"] - 1] + "&V_SRVC_CD=" + this.V_SRVC_CD + "&V_USR_NM=" + this.V_USR_NM + "&V_SRC_CD=" + this.V_SRC_CD + "&V_PRCS_ID=" + this.V_PRCS_ID + "&REST_Service=Forms_Record&Verb=DELETE";
    console.log(del_URL);
    del_URL = encodeURI(del_URL);
    console.log(del_URL);

    this.http.delete(del_URL).subscribe(
      res => {
        console.log("Response:\n" + res);
      });
  }

  build_PVP(form) {
    this.currentDate = dateFormat(new Date(), "ddd mmm dd yyyy hh:MM:ss TT o");
    //-------Update PVP--------//
    console.log(form);
    var PVP_str = "{";
    var key;
    for (let i = 0; i < this.RVP_labels.length; i++) {
      key = this.RVP_labels[i].split(" ").join("_");
      PVP_str += "\"" + key + "\"" + ":[";
      for (let j = 0; j < this.totalRow - 1; j++) {
        PVP_str += "\"" + form[key][j] + "\"";
        if (j < this.totalRow - 2)
          PVP_str += ",";
      }
      PVP_str += "]";
      if (i < this.RVP_labels.length - 1)
        PVP_str += ",";
    }
    PVP_str += "}";
    console.log(PVP_str);

    let body_buildPVP = {
      "V_USR_NM": this.V_USR_NM,
      "V_EXE_CD": this.Check_RPT_NRPT,
      "V_PRCS_TXN_ID": this.V_PRCS_TXN_ID,
      "V_APP_ID": this.V_APP_ID,
      "V_PRCS_ID": this.V_PRCS_ID,
      "V_SRVC_ID": this.V_SRVC_ID,
      "V_PVP": PVP_str,
      "V_RELEASE_RSN": "Submitted manual input",
      "V_SRC_ID": this.V_SRC_ID,
      "V_OPERATION": "MANUALSUBMIT",
      "V_UNIQUE_ID": this.V_UNIQUE_ID,
      "TimeZone": this.currentDate
    }
    console.log(body_buildPVP);

    this.http.post("https://" + this.domain_name + "/rest/Submit/FormSubmit", body_buildPVP).subscribe(
      res => {
        console.log(res);
        this.invoke_router(res);
      });
  }
  Field_Names_initial = '';
  Field_Values_initial = "";
  ngOnInit() {
    this.getFormData();
    for (let i = 0; i < this.RVP_labels.length; i++) {
      this.input[this.RVP_labels[i]] = [];
    }
    var row_present = this.RVP_DataObj[this.RVP_labels[0].split(" ").join("_")].length;
    this.totalRow += row_present;
    for (let i = 1; i < this.totalRow; i++) {
      this.rows.push(i);
    }
    console.log("Iterations :");
    console.log(this.rows);
    for (let i = 0; i < this.totalRow; i++) {
      for (let j = 0; j < this.RVP_labels.length; j++) {
        this.input[this.RVP_labels[j]][i] = this.RVP_DataObj[this.RVP_labels[j].split(" ").join("_")][i];
      }
    }

    var form: any[][] = [];
    for (let i = 0; i < this.totalRow; i++) {
      for (let j = 0; j < this.RVP_labels.length; j++) {
        const form_key = this.RVP_labels[j].split(" ").join("_");
        if (CommonUtils.isValidValue(form[form_key])) {
          form[form_key] = this.input[this.RVP_labels[j]][i];
          if (!CommonUtils.isValidValue(form[form_key][i])) {
            form[this.RVP_labels[j].split(" ").join("_")][i] = "";
          }
        }
      }
    }
    var key_array = Object.keys(form)
    for (let i = 0; i < key_array.length; i++) {
      if (i != 0) {
        this.Field_Names_initial += '|';
        this.Field_Values_initial += '|';
      }
      this.Field_Names_initial += "\"" + key_array[i] + "\"";
      this.Field_Values_initial += "\"" + form[key_array[i]] + "\"";
    }

    // this.Field_Names_initial += '|\"V_abcd\"';
    // this.Field_Values_initial += '|\"\"';

  }

  addRow() {

    var areAllDisabled = true;
    for (let i = 0; i < this.totalRow; i++) {
      if (!this.isDisabled[i]) {
        areAllDisabled = false;
      }
    }
    if (areAllDisabled) {
      this.rows.push(this.totalRow);
      ++this.totalRow;
      this.edit_or_done[this.totalRow - 1] = "done";
      this.isDisabled[this.totalRow - 1] = false;
      this.deleted[this.totalRow - 1] = false;
    }
  }

  editTick_click(i) {
    this.isDisabled[i] = !this.isDisabled[i];
    if (this.edit_or_done[i] === "edit") {
      this.edit_or_done[i] = "done";
    } else {
      this.edit_or_done[i] = "edit";
      var form: any = [];
      for (let j = 0; j < this.RVP_labels.length; j++) {
        form[this.RVP_labels[j].split(" ").join("_")] = this.input[this.RVP_labels[j]][i];
        if (form[this.RVP_labels[j].split(" ").join("_")] == null) {
          form[this.RVP_labels[j].split(" ").join("_")] = "";
        }
      }
      form["iteration"] = i;
      console.log(form);
      if (this.V_TABLE_NAME === null || this.V_TABLE_NAME.length > 0)
        this.updateForm(form);
    }
  }

  delete_click(i) {
    this.deleted[i] = true;
    var form: any = [];
    for (let j = 0; j < this.RVP_labels.length; j++) {
      form[this.RVP_labels[j].split(" ").join("_")] = this.input[this.RVP_labels[j]][i];
      if (form[this.RVP_labels[j].split(" ").join("_")] == null) {
        form[this.RVP_labels[j].split(" ").join("_")] = "";
      }
    }
    form["iteration"] = i;
    console.log(form);
    if (this.V_TABLE_NAME === null || this.V_TABLE_NAME.length > 0)
      this.deleteForm(form);
  }

  onCancel() {
    console.log("Cancelled");
    this.router.navigateByUrl("End_User");
  }

  onSubmit() {
    console.log('submitting');
    var form: any = [];
    var temp: any;
    for (let i = 0; i < this.RVP_labels.length; i++) {
      for (let j = 1; j < this.totalRow; j++) {
        temp = this.input[this.RVP_labels[i]][j]
        if (temp == null) {
          temp = "";
        }
        if (j === 1)
          form[this.RVP_labels[i].split(" ").join("_")] = [temp];
        else
          form[this.RVP_labels[i].split(" ").join("_")].push(temp);
      }
    }
    console.log(form);
    var areAllDisabled = true;
    for (let i = 0; i < this.totalRow; i++) {
      if (!this.isDisabled[i]) {
        areAllDisabled = false;
      }
    }
    if (areAllDisabled)
      this.build_PVP(form);
  }

}