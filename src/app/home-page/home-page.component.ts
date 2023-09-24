import { Component } from '@angular/core';
import { Router,ActivatedRoute , RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { TokenService } from '../shared/token.service';





@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {


  languages = [
    { name: 'ع', code: 'ar' },
    { name: 'FR', code: 'fr' },
  ]


token:any;

selectedLanguage:String="";

options: any[] = [
  { label: `
        <div style="display: flex; flex-direction: column;">
            <p>
                GU Nouakchott Nord
            </p>
            <p>
                Wilaya Nouakchott-Nord
            </p>
        </div>
  
  `, value: 'option1' },
  { label: `    <div>
  <button (click)="logout()" style="border-color: transparent;align-items: center;display: flex;"><img src="https://www.simpleimageresizer.com/_uploads/photos/d306fffc/logout-8_25x25.png"
          alt="Image" class="icon">
      <span>Disconnect</span></button>

</div>`, value: 'option2' },
];
showLogout:boolean=false;
  constructor(private router: ActivatedRoute ,private http: HttpClient,private tokenService:TokenService) {

  
  }



  ngOnInit() {
    console.log(this.token);
  }

  logout(){
    console.log("hello");
  }



}
