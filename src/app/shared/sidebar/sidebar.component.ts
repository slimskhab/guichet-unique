import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { TokenService } from '../token.service';


interface MenuObject{
  "code": any,
  "icon":any,
  "tooltip": string,
  "admin": boolean,
  "actif": boolean,
  "libelleFr": string,
  "libelleAr": string,
  "title":string,
  "isChecked": boolean,
  "path": string,
  "dtMaj": string,
  "libelleEn": string,
  "menuId": any,
  "submenus":MenuObject[],
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  menuObjects:MenuObject[]=[];
  token:any;
  isSidebarVisible = false;

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }


  menuItems:MenuItem[]=[];
  constructor(private http: HttpClient,private tokenService:TokenService) {
    this.token=tokenService.getToken();
  
  }

  fetchMenu(){
    const url = 'http://127.0.0.1:8063/admFonc/menu?lang=fr';
    const headers = {
      'Authorization': 'Bearer ' + this.tokenService.getToken()
    };
    this.http.get<any>(url,{headers}).subscribe(
      (response: any) => {
        this.menuObjects=response.payload;
        this.menuItems=this.menuObjects.map((menuObject: MenuObject) => {
          const menuItem: any = {
            label: menuObject.libelleFr, 
            icon: menuObject.icon, 
            routerLink: menuObject.path, 
          };
        
          // Check if menuObject has submenus
          if (menuObject.submenus && menuObject.submenus.length > 0) {
            menuItem.items = menuObject.submenus.map((submenu: MenuObject) => ({
              label: submenu.libelleFr, 
              routerLink: submenu.path, 
            }));
          }
        
          return menuItem;
        });
        
      },
      (error) => {
        console.error(error);
      }
    );
  }

  ngOnInit() {
    this.fetchMenu();
  }


}
