import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../token.service';
import { HttpClient } from '@angular/common/http';

interface Info {
  codeCateg: string
desEtabAr: string
desEtabFr: string
email: string
idAdmPersonnel: any
idAdmUser: any
idEtab: any
idWilaya: any
login: string
nom: string
prenom: string
}


@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent {
whoAmInfo?:Info;

  token:any;
  languages = [
    { name: 'ع', code: 'ar' },
    { name: 'FR', code: 'fr' },
  ];
  options: any[] = [];

  selectedLanguage: String = "";
constructor(private router: Router,private tokenService:TokenService, private http: HttpClient){
  this.token=tokenService.getToken();
}

ngOnInit(){
  this.fetchUserType();
}

fetchUserType() {
  const url = 'http://127.0.0.1:8062/whoiam';
  const headers = {
    'Authorization': 'Bearer ' + this.tokenService.getToken()
  };

  this.http.get<any>(url, { headers }).subscribe(
    (response: any) => {
this.whoAmInfo=response.payload;

this.options=[
  {
    label: `
      <div style="display: flex; flex-direction: column;">
          <p>
              ${this.whoAmInfo?.codeCateg} ${this.whoAmInfo?.prenom}
          </p>
          <p>
              ${this.whoAmInfo?.desEtabFr}
          </p>
      </div>

`, value: 'option1'
  },
  {
    label: `    
    <img src="https://i.postimg.cc/Qt2jtgcB/2529508-25x25.png" alt="Image" class="icon">
    <span>Disconnect</span>
  
  
  `, value: 'option2'
  },
];
    },
    (error) => {
      console.error(error);
    }
  );
}

  onDropdownChange(selectedType: any): void {
    this.router.navigate(['/public/authentification/login']);

  }
}
