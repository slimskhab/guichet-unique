import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { TokenService } from '../shared/token.service';
import { DatePipe,Location } from '@angular/common';
import { Title } from '@angular/platform-browser';




interface Request {
  id?: any;
  type: String;
  entitled: String;
}

interface Requerant {
  idCivReq: any,
  adresseContact: string,
  nomResp: string,
  idTypeReq: any,
  prenomsResp: string,
  cin: string,
  nom: string,
  emailContact: string,
  telContact: string,
  denomination: string,
  rc: string,
  cinResp: string,
  idDecoupGeo: any,
  adresse: string,
  id: any,
  prenom: string,
  fullName: string;
}


interface Moughataa {
  id: any,
  idDecoupGeoParent: any,
  code: String,
  libelleFr: String,
  libelleAr: String,
  dtDelete: any,
  dtMaj: any,
  children: any

}


interface Sexe {
  dtMaj: any,
  code: String,
  libelleEn: String,
  ordre: any,
  id: any,
  libelleFr: String,
  libelleAr: String,
}

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

interface Type {
  code: any,
  id: any,
  libelleFr: String,
  libelleAr: String
}

@Component({
  selector: 'app-modify-request',
  templateUrl: './modify-request.component.html',
  styleUrls: ['./modify-request.component.css']
})
export class ModifyRequestComponent {

  text: string = '';
  items: MenuItem[] = [];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/app/acc' };
  requestNumber: String = "20xx/xxx/xxx";
  nni: String = "";
  lastName: String = "";
  name: String = "";
  adresse: String = "";
  adresseOfContact: String = "";
  phoneNumber: String = "";
  email: String = "";
  description: String = "";
  sexe: any;
  sexes: Sexe[] = [];
  type: any;
  types: Type[] = [];

  object: String = "";

  dateOfRequest: Date = new Date();
  dateOfProblem: Date = new Date();




  requests: Request[] = [
    { type: "write", entitled: "something", id: "01" }, { type: "some type", entitled: "something", id: "05" },
  ];



  services: Service[] = [];
  selectedServices: Service[] = [];

  wilaya: any;
  wilayet: Moughataa[] = []

  moughataa: any;
  moughataat: Moughataa[] = [];


  requestId: any;
  request: any;

  userDecoupGeo: Moughataa[] = [];
  userWilaya: any;
  userMoughataa: any;
  userCommune: any;
  requerantId: any;
  requeteId: any;
  idEtab: any;
  idAdmUser: any;


  isCommune: boolean = true;
  commune: any;
  communes: Moughataa[] = [];

  showButtons = false;


  showExtraFields: boolean = false;
  showCinPopUp: boolean = false;
  requerant!: Requerant;
  requerants: Requerant[] = [];

  isAddVisible: boolean = false;
  selectedLanguage: String = "";



  requestForm = this.formBuilder.group({
    requestNumber: [{ value: '20xx/xxx/xxx', disabled: true }],
    dateOfRequest: ['', Validators.required],
    nni: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    name: ['', Validators.required],
    lastName: ['', Validators.required],
    sexe: [''],
    type: [''],
    wilaya: ['', Validators.required],
    moughataa: [{ value: '', disabled: false }, Validators.required,],
    commune: [{ value: '', disabled: false }, Validators.required],
    adresse: [''],
    adresseOfContact: [''],
    phoneNumber: [''],
    email: [''],
    object: ['', Validators.required],
    selectedServices: ['', Validators.required],
    description: ['', Validators.required],
    dateOfProblem: ['', Validators.required],
    actionsEntreprises: [''],
    nniResp: [''],
    rc: [''],
    nomResp: [''],
    prenomResp: [''],
    denomination: [''],

  })

  typeId:any;

  menuItems: MenuItem[] = [];


  constructor(private router: Router,private location: Location,private renderer: Renderer2, private elementRef: ElementRef, private route: ActivatedRoute, private http: HttpClient, private formBuilder: FormBuilder, private tokenService: TokenService, private titleService: Title) {


  }

  ngOnInit() {
    this.items = [{ label: 'Prise en charge des requêtes' }, { label: 'Liste des requêtes', routerLink: '/app/req/lr' }, { label: 'Modifier requête' }];
    this.filteredRequests = this.requests;
    const idParam = this.route.snapshot.paramMap.get('idreq');
    this.requestId = idParam ? parseInt(idParam, 10) : 0;
    this.fetchNomenclature();
    this.titleService.setTitle('Modifier requête');
  }

  setValueAndAddClass(fieldName: string, value: any, renderer: Renderer2) {
    const formControl = this.requestForm.get(fieldName);
    

    if(value){
      if (formControl) {
        formControl.patchValue(value);
  
        const inputElement = document.querySelector(`input[formControlName="${fieldName}"]`);
        if (inputElement) {
          renderer.addClass(inputElement, 'p-filled');
        }
      }
    }


  }

  async setRequestAttributes(requerant: Requerant) {
    this.requestForm.get('requestNumber')?.setValue(this.request.numReq);
    this.setValueAndAddClass('requestNumber', this.request.numReq, this.renderer);
    this.setValueAndAddClass('nni', requerant.cin, this.renderer);
    this.setValueAndAddClass('lastName', requerant.nom, this.renderer);
    this.setValueAndAddClass('name', requerant.prenom, this.renderer);


    await this.fetchRequerantLocation(this.requerant.idDecoupGeo);

    const firstSexe = this.sexes[(requerant.idCivReq) - 1];
    this.sexe = firstSexe;

    this.setValueAndAddClass('adresse', requerant.adresse, this.renderer);
    this.setValueAndAddClass('adresseOfContact', requerant.adresse, this.renderer);
    this.setValueAndAddClass('phoneNumber', requerant.telContact, this.renderer);
    this.setValueAndAddClass('email', requerant.emailContact, this.renderer);
    this.setValueAndAddClass('object', this.request.objet, this.renderer);
    this.setValueAndAddClass('description', this.request.desc, this.renderer);
    this.setValueAndAddClass('actionsEntreprises', this.request.actionsEnt, this.renderer);

    this.dateOfRequest = new Date(this.request.dtRequete);

    this.dateOfProblem = new Date(this.request.datAppPb);



  }

  formatDate(inputDate: string): string {
    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(new Date(inputDate), 'yyyy-MM-dd');
    return formattedDate || '';
  }




  fetchRequerant() {
    const url = 'http://127.0.0.1:8101/requerant/id/' + this.request.idRequerant;

    this.http.get<any>(url).subscribe(
      (response: any) => {
        console.log("requerant is : ", response);
        this.requerant = response.payload;
        this.setRequestAttributes(response.payload);
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
        console.log("request is : ", response);
        this.request = response;
      this.requerantId=response.idRequerant;
        this.request.services = [];
        this.fetchRequerant();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  async onDropDownChangeRequerant() {
    const firstSexe = this.sexes[(this.requerant.idCivReq) - 1];
    this.sexe = firstSexe;

    this.type = this.types[(this.requerant.idTypeReq) - 1];
    this.onDropdownChangeType(this.type);

    await this.fetchRequerantLocation(this.requerant.idDecoupGeo);


    this.showButtons = true;
  }

  //FETCH FUNCTIONS



  fetchWilayet() {
    const url = 'http://127.0.0.1:8064/rcDecoupGeo/comboParent';

    this.http.get<Moughataa[]>(url).subscribe(
      (response: Moughataa[]) => {
        this.wilayet = response;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  fetchSexe() {
    const url = 'http://127.0.0.1:8064/nmSexe/';

    this.http.get<Sexe[]>(url).subscribe(
      (response: any) => {

        this.sexes = response.payload;
        this.sexe = this.sexes[0];
      },
      (error) => {
        console.error(error);
      }
    );
  }

  fetchServices() {
    const url = 'http://127.0.0.1:8064/rcServPublic/combo';

    this.http.get<Service[]>(url).subscribe(
      (response: Service[]) => {
        this.services = response;
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

  fetchTypes() {
    const url = 'http://127.0.0.1:8064/nmType/';
    this.http.get<Type[]>(url).subscribe(
      (response: any) => {
        this.types = response.payload;
        this.typeId=1;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  fetchRequerants() {

    const nniValue = this.requestForm.get('nni')?.value;
    const url = `http://127.0.0.1:8101/requerant/cin/${nniValue}`;

    this.http.get(url).subscribe(
      (response: any) => {
        if (response.payload.length != 0) {
          this.showCinPopUp = true;
          this.requerants = response.payload;
          for (const element of this.requerants) {
            element.fullName = element.nom + " " + element.prenom;
          }
        }

      },
      (error: any) => {
        console.log("requerant not found");
      }
    );
  }


  

  fetchNomenclature() {
    this.fetchWilayet();
    this.fetchSexe();
    this.fetchServices();
    this.fetchTypes();
    this.fetchRequest();
    this.fetchSelectedServices();

  }
  openAddDialog() {
    this.isAddVisible = true;
  }


  //DROPDOWN CHANGES

  onDropdownChangeWilaya(selectedWilaya: any): void {

    this.requestForm.get('commune')?.disable();

    this.commune = null;
    this.moughataa = null;
    this.communes = [];
    this.wilaya = selectedWilaya;

    const url = 'http://127.0.0.1:8064/rcDecoupGeo/comboFils/' + this.wilaya.id;

    this.http.get<Moughataa[]>(url).subscribe(
      (response: Moughataa[]) => {
        this.moughataat = response;

        this.requestForm.get('moughataa')?.enable();
      },
      (error) => {
        console.error(error);
      }
    );

  }


  onDropdownChangeMoughataa(selectedMoughataa: any): void {
    this.moughataa = selectedMoughataa;

    const url = 'http://127.0.0.1:8064/rcDecoupGeo/comboFils/' + this.moughataa.id;

    this.http.get<Moughataa[]>(url).subscribe(
      (response: Moughataa[]) => {
        this.communes = response;


        this.requestForm.get('commune')?.enable();

      },
      (error) => {
        console.error(error);
      }
    );



  }

  closeDialog() {
    this.isAddVisible = false;
  }

  onDropdownChangeType(selectedType: any): void {
    if (selectedType.id == 2) {
      this.showExtraFields = true;
      this.typeId=2;
    } else {
      this.showExtraFields = false;
      this.typeId=1;
    }

  }
  onDropdownChangeSexe(selectedType: any): void {
    this.sexe = selectedType;
  }



  filteredRequests: Request[] = [];
  filterValue: string = "";

  applyFilter() {
    this.filteredRequests = this.requests.filter(request =>
      request.id.toString().includes(this.filterValue) ||
      request.type.toLowerCase().includes(this.filterValue.toLowerCase()) ||
      request.entitled.toString().includes(this.filterValue)
    );
  }






  // DIALOG ATTRIBUTES

  documentNumber: String = "";
  documentEntitled: String = "";
  documentTypes = [
    { name: "Fiche requête", code: "fiche-requete" },
    { name: "Carte d'identité", code: "carte-identite" },
    { name: "Autre", code: "autre" },
    { name: "NOTE", code: "note" },
  ]
  documentType: String = "";



  // DIALOG FUNCTIONS
  addRequest() {
    let newRequest = { type: this.documentType, entitled: this.documentEntitled, id: this.documentNumber };
    this.requests.push(newRequest);
    this.isAddVisible = false;
  }





  updateRequerant() {

    const requerantUrl = 'http://127.0.0.1:8101/requerant/'+this.requerantId;

    if (this.requestForm.valid) {
      const requerantData = {
        cin: this.requestForm.get('nni')?.value,
        nom: this.requestForm.get('lastName')?.value,
        prenom: this.requestForm.get('name')?.value,
        adresse: this.requestForm.get('adresse')?.value,
        adresseContact: this.requestForm.get('adresseOfContact')?.value,
        idTypeReq: this.typeId,
        telContact: this.requestForm.get('phoneNumber')?.value,
        emailContact: this.requestForm.get('email')?.value,
        cinResp: this.requestForm.get('nniResp')?.value,
        rc: this.requestForm.get('rc')?.value,
        nomResp: this.requestForm.get('nomResp')?.value,
        prenomsResp: this.requestForm.get('prenomResp')?.value,
        denomination: this.requestForm.get('denomination')?.value,
        idCivReq: this.sexe.id,
        idDecoupGeo: this.commune.id,
      };



      this.http.put<Requerant>(requerantUrl, requerantData)
        .subscribe(
          async (response) => {
            console.log("new requerant has : ",response);
            await this.deleteServices();
            await this.saveServices();
            await this.updateRequete();
            this.refreshPage();

          },
          (error) => {
            console.error('Error adding requerant:', error);
          }
        );

    }

  }


  deleteServices(){
    const requerantUrl = 'http://127.0.0.1:8101/service/delete/'+this.requestId;

    this.http.delete<Requerant>(requerantUrl)
        .subscribe(
          async (response) => {
            console.log("Deleted all services ",response);
          },
          (error) => {
            console.error('Error adding requerant:', error);
          }
        );


  }
  

  refreshPage() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl(currentUrl);
    });
  }

  saveServices() {
    const serviceUrl = 'http://127.0.0.1:8101/service/add';
    const selectedServicess = this.requestForm.get("selectedServices")?.value as unknown as any[] || [];

console.log(selectedServicess);
    if (selectedServicess) {
      for (const element of selectedServicess) {
        const serviceData = {
          idReq: this.requestId,
          idServPub: element,
        };
        console.log("serviceData is : ", serviceData);
        this.http.post<Service>(serviceUrl, serviceData)
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

  updateRequete() {
    const dateOfRequest = this.requestForm.get("dateOfRequest")?.value;
    const formattedDateOfRequest = dateOfRequest ? this.formatDate(dateOfRequest) : '';


    const dateOfProblem = this.requestForm.get("dateOfProblem")?.value;
    const formattedDateOfProblem = dateOfProblem ? this.formatDate(dateOfProblem) : '';



    const requeteUrl = 'http://127.0.0.1:8101/requete/'+this.requestId;
    console.log("action entreprise :" ,this.requestForm.get('actionsEntreprises')?.value,)
    const requeteData = {
      idTypeReq: null,
      idNivUrgReq: null,
      idRequerant: this.requerantId,
      idEtatReq: 1,
      dtRequete: formattedDateOfRequest,
      adresse: this.requestForm.get('adresse')?.value,
      desc: this.requestForm.get('description')?.value,
      datAppPb: formattedDateOfProblem,
      objet: this.requestForm.get('object')?.value,
      actionsEnt: this.requestForm.get('actionsEntreprises')?.value,
      f_valid: 0,
      motifRejet: null,
      datLimite: null,
      idEtab: this.idEtab,
      idUser: this.idAdmUser,
    };

    this.http.put<any>(requeteUrl, requeteData)
      .subscribe(
        (response) => {
          console.log("updated request is :",response);
        },
        (error) => {
          console.error('Error adding requete:', error);
        }
      );
  }





  fetchRequerantLocation(childrenId: any) {
    const url = 'http://127.0.0.1:8064/rcDecoupGeo/getParent/' + childrenId;

    this.http.get<Moughataa[]>(url).subscribe(
      (response: Moughataa[]) => {
        this.userDecoupGeo = response;
        this.wilaya = this.userDecoupGeo[2];

        this.onDropdownChangeWilaya(this.userDecoupGeo[2]);
        this.moughataa = this.userDecoupGeo[1];


        this.onDropdownChangeMoughataa(this.userDecoupGeo[1])
        this.commune = this.userDecoupGeo[0];


      },
      (error) => {
        console.error(error);
      }
    );
  }






  showValidationMessage(field: string): void {
    this.requestForm.get(field)?.markAsTouched();
  }

  showErrorMessage(field: string): boolean {
    return this.requestForm.get(field)?.touched || false;
  }

}
