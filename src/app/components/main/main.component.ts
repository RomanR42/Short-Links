import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder, Validators} from '@angular/forms';
import {GetdataService} from '../../shared/getdata.service';
import {Response} from '../../shared/response';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(private formBuilder:FormBuilder,
              private getdataService:GetdataService)
               { }

  sendForm:FormGroup;
  sbmControlValid:boolean= false;
  isDataReady:boolean=false;
  resultArray: Response[]=[];


  ngOnInit(): void {
    this.sendForm = this.formBuilder.group ({
      send: [ "", [Validators.required, Validators.pattern("https?:\/\/.+")]]
    });
    if (localStorage.getItem('shortLinks')) {
      let dataFromLS = JSON.parse (localStorage.getItem('shortLinks'));
            
      if (dataFromLS.length > 0) {
        this.resultArray = dataFromLS;
      }
    }
  }

  onInput() {
    this.sbmControlValid = false;
  }

  sendRequest() {
        
    if (!this.sendForm.valid) {
      if (this.sendForm.get('send').hasError('required')) {this.sbmControlValid = true};
      return;
    }
    this.isDataReady = true;
      
    this.getdataService.getData(this.sendForm.value.send).subscribe (data => {

      this.isDataReady = false;
      let shortLink = data['result'].full_short_link3;
      let originLink = data['result'].original_link;
      this.resultArray.push(new Response(shortLink,originLink));
      localStorage.setItem ('shortLinks', JSON.stringify(this.resultArray));
    }, (err: HttpErrorResponse) => {
        this.isDataReady = false;
        alert (err);
    
      }) ;
   
   
  }

  copy(shortLink:string, btn) {
         
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = shortLink;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    let copyBtns = document.getElementsByClassName ('copyBtn');
    for (let i=0; i<copyBtns.length; i++){
      if (copyBtns[i].innerHTML == 'Copied') {
        copyBtns[i].innerHTML = 'Copy';
        copyBtns[i]['style'].backgroundColor ='hsl(180, 66%, 49%)';
      }
    }
    
    btn.style.backgroundColor ='hsl(257, 27%, 26%)';
    btn.innerHTML = 'Copied';
  }

}
