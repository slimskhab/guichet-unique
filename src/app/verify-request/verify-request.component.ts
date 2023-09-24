import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TokenService } from '../shared/token.service';
import { DatePipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ChangeDetectorRef } from '@angular/core';




interface Service {
  id: any;
  idServParent: any,
  codeServ: String,
  desServAr: String,
  desServFr: String,
  dtMaj: any,
  dtDelete: any,
  children: any,
}

@Component({
  selector: 'app-verify-request',
  templateUrl: './verify-request.component.html',
  styleUrls: ['./verify-request.component.css']
})
export class VerifyRequestComponent implements OnInit {
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/app/acc' };
  items: MenuItem[] = [];
  requestId: any;
  request: any;
  services: Service[] = [];
  requerant: any;
  showOptions: boolean = false;
  showMotif: boolean = false;
  types: any[] = [];
  urgences: any[] = [];
  organismes: any[] = [];
  selectedServices: Service[] = [];
  acceptRefuse: any[] = ["Oui", "Non"];
  selectedOption:any;
  typeReq:any;
  nivUrgReq:any;



  formGroup = this.formBuilder.group({
    selectedServices: ["", Validators.required],
    rejectionReason: ["", Validators.required],
    selectedOrganismes: ["", Validators.required],
    urgence: ["", Validators.required],
    type: ["", Validators.required],
    acceptRefuse: ["", Validators.required]
  })


  ngOnInit() {
    this.items = [{ label: 'Prise en charge des requêtes' }, { label: 'Avis et qualification', routerLink: '/app/req/lrv' }];
    const idParam = this.route.snapshot.paramMap.get('id');
    this.requestId = idParam ? parseInt(idParam, 10) : 0;
    this.titleService.setTitle('Avis et qualification');
    this.fetchRequest();
    this.fetchNomenclature();

  }



  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute, private titleService: Title, private formBuilder: FormBuilder,) {
  }


  
  saveOrganismes() {
    const organismeUrl = 'http://127.0.0.1:8101/organisme/add';
    const selectedOgnaismess = this.formGroup.get("selectedOrganismes")?.value as unknown as any[] || [];

    if (selectedOgnaismess) {
      for (const element of selectedOgnaismess as any[]) {
        const organismeData = {
          idReq: this.requestId,
          idOrg: element.idOrg,
        };
        this.http.post<any>(organismeUrl, organismeData)
          .subscribe(
            (response) => {
            },
            (error) => {
              console.error('Error adding requerant:', error);
            }
          );
      }

    }

  }

async getRequestState(){
  const url = 'http://127.0.0.1:8064/nmEtatRequete/' + this.request.idEtatReq;
    try {
      const response = await this.http.get<any>(url).toPromise();
      if (response) {
        this.request.etatReq=response.payload.desEtatReqFr;
        
      }
    } catch (error) {
      console.error(error);
    }
}

  disabledButton():boolean{
if(!this.formGroup.get('acceptRefuse')?.valid){
return true;
}
    if(this.selectedOption=="Oui"){
      return !this.formGroup.get('urgence')?.valid||!this.formGroup.get('selectedServices')?.valid||!this.formGroup.get('type')?.valid||!this.formGroup.get('selectedOrganismes')?.valid;
    }
    else if (this.selectedOption=="Non"){
      return !this.formGroup.get('rejectionReason')?.valid;
    }else{
      return false;
    }
  }

  fetchNomenclature() {
    this.fetchRequestType();
    this.fetchUrgence();
    this.fetchServices();
    this.fetchOrganisme();
  }


  fetchOrganisme() {
    const url = 'http://127.0.0.1:8064/rcOrg/getList';

    this.http.get<any>(url).subscribe(
      (response: any) => {
        this.organismes = response;
      },
      (error) => {
        console.error(error);
      }
    );
  }




  updateRequest() {
    const url = 'http://127.0.0.1:8101/requete/update/'+this.requestId;
  
let requestData;
    if(this.selectedOption=="Oui"){
      requestData= {
        idTypeReq: this.typeReq.id,
        idNivUrgReq: this.nivUrgReq.idNivUrgReq,
        idEtatReq: 3
      };
    }else{
      requestData= {
        idTypeReq: null,
        idNivUrgReq: null,
        motifRejet:this.formGroup.get("rejectionReason")?.value,
        idEtatReq: 2
      };
    }

    this.http.put(url,requestData).subscribe(
      (response: any) => {
        this.saveOrganismes();
        this.router.navigate(['/app/req/lrv']);
      },
      (error) => {
        console.error(error);
      }
    );
    
    
  }

  async fetchSelectedServices() {
    const url = 'http://127.0.0.1:8101/service/reqid/' + this.requestId;
    try {
      const response = await this.http.get<number[]>(url).toPromise();
      if (response) {
        this.request.servicesText = "";
        const selectedServices = [];
        for (const element of response) {
          const service = await this.fetchServiceById(element);
          this.request.services.push(service);
          this.request.servicesText += service.desServFr + ",";
          selectedServices.push(service);
        }

        this.selectedServices = selectedServices.map(service => service.id);


      }
    } catch (error) {
      console.error(error);
    }
  }

  fetchServices() {
    const url = 'http://127.0.0.1:8064/rcServPublic/combo';

    this.http.get<Service[]>(url).subscribe(
      (response: Service[]) => {
        this.services = response;
        this.fetchSelectedServices();
        this.selectedServices = this.services;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  fetchRequest() {
    const url = 'http://127.0.0.1:8101/requete/id/' + this.requestId;

    this.http.get<any>(url).subscribe(
      (response: any) => {
        this.request = response;
        this.request.services = [];
        this.fetchRequerant();
        this.getRequestState();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  fetchRequerant() {
    const url = 'http://127.0.0.1:8101/requerant/id/' + this.request.idRequerant;

    this.http.get<any>(url).subscribe(
      (response: any) => {
        this.requerant = response.payload;
      },
      (error) => {
        console.error(error);
      }
    );
  }





  async fetchServiceById(serviceId: number): Promise<any> {
    const url = 'http://127.0.0.1:8064/rcServPublic/' + serviceId;

    try {
      const response = await this.http.get<any>(url).toPromise();
      return response.payload;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }








  fetchRequestType() {
    const url = 'http://127.0.0.1:8064/nmTypeReq/';
    this.http.get<any>(url).subscribe(
      (response: any) => {
        this.types = response.payload;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  fetchUrgence() {
    const url = 'http://127.0.0.1:8064/nmNivUrgReq/';
    this.http.get<any>(url).subscribe(
      (response: any) => {
        this.urgences = response.payload;
      },
      (error) => {
        console.error(error);
      }
    );
  }




  onDropDownChangeAccept(event: any) {
    if (event == "Oui") {
      this.showOptions = true;
      this.showMotif = false;
    } else {
      this.showMotif = true;
      this.showOptions = false;
    }
  }

}
