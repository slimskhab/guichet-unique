import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api'
import { TokenService } from '../shared/token.service';

import { Title } from '@angular/platform-browser';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = "";
  password: string = "";
  error: string = "";
  showEmailIsEmpty: boolean = false;
  showPasswordIsEmpty: boolean = false;
  showWrongAuth: boolean = false;
  showProgressIndicator: boolean=false;
  showPassword: boolean = false;



  constructor(private router: Router,private http: HttpClient,private tokenService:TokenService,private titleService: Title) { }


  ngOnInit(){
    this.titleService.setTitle('Authentification');

  }

  async login(): Promise<void> {

    this.showProgressIndicator=true;
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Added to simulate some work on the server

    const url = 'http://127.0.0.1:8062/authenticate';
    const requestBody = {
      login: this.username,
      password: this.password
    };
  
    this.http.post(url, requestBody).subscribe(
      (response:any) => {
        if (response.code === "200") {
          this.showProgressIndicator=false;
          this.tokenService.setToken(response.payload.token);
          this.fetchUserType();
          //this.router.navigate(['/app/acc']);
        } else {
          console.log('Wrong email or password');
        }
      },
      (error) => {
        console.error(error);
      }
    );

    
  }

  changeLanguage(): void {
    console.log("langauge switched");
  }




  fetchUserType(){
    const url = 'http://127.0.0.1:8062/whoiam';
    const headers = {
      'Authorization': 'Bearer ' + this.tokenService.getToken()
    };
  
    this.http.get<any>(url,{headers}).subscribe(
      (response: any) => {
        if(response.payload.codeCateg=="GU"){
          this.router.navigate(['/app/acc']);
        }
        else if (response.payload.codeCateg=="IN"){
          this.router.navigate(['/app/req/lrv']);
        }else if (response.payload.codeCateg=="RS"){
          this.router.navigate(['/app/req/lra']);
        }else{
          this.router.navigate(['/app/acc']);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
