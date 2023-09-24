import { Component, Renderer2 } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { TokenService } from '../shared/token.service';
import { DatePipe } from '@angular/common';
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
  selector: 'app-register-request',
  templateUrl: './register-request.component.html',
  styleUrls: ['./register-request.component.css']
})



export class RegisterRequestComponent {
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

  isWilaya: boolean = true;
  wilaya: any;
  wilayet: Moughataa[] = []

  isMoughataa: boolean = true;
  moughataa: any;
  moughataat: Moughataa[] = [];


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
  showEditingForm: boolean = false;
  requerant!: Requerant;
  requerants: Requerant[] = [];

  isAddVisible: boolean = false;
  selectedLanguage: String = "";

  docTypes: any[] = [];
  docType: any;

  isEditUser:boolean=false;

  typeId: any;

  requestForm = this.formBuilder.group({
    requestNumber: [{ value: '20xx/xxx/xxx', disabled: true }],
    dateOfRequest: [new Date(), Validators.required],
    nni: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    name: ['', Validators.required],
    lastName: ['', Validators.required],
    sexe: [''],
    type: [''],
    wilaya: ['', Validators.required],
    moughataa: [{ value: '', disabled: this.isWilaya }, Validators.required,],
    commune: [{ value: '', disabled: this.isMoughataa }, Validators.required],
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


  menuItems: MenuItem[] = [];

  formatDate(inputDate: string): string {
    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(new Date(inputDate), 'yyyy-MM-dd');
    return formattedDate || '';
  }


  enableAllFormControls() {

    this.requerant = {} as Requerant;
    this.showExtraFields = false;
    this.requestForm.get('name')?.enable();
    this.requestForm.get('name')?.setValue('');

    this.requestForm.get('lastName')?.enable();
    this.requestForm.get('lastName')?.setValue('');

    this.requestForm.get('sexe')?.enable();
    this.requestForm.get('sexe')?.setValue('');

    this.requestForm.get('type')?.enable();
    this.requestForm.get('type')?.setValue('');

    this.requestForm.get('nniResp')?.enable();
    this.requestForm.get('nniResp')?.setValue('');

    this.requestForm.get('denomination')?.enable();
    this.requestForm.get('denomination')?.setValue('');
    this.requestForm.get('rc')?.enable();
    this.requestForm.get('rc')?.setValue('');
    this.requestForm.get('nomResp')?.enable();
    this.requestForm.get('nomResp')?.setValue('');
    this.requestForm.get('prenomResp')?.enable();
    this.requestForm.get('prenomResp')?.setValue('');


    this.requestForm.get('wilaya')?.enable();
    this.requestForm.get('wilaya')?.setValue('');


    this.requestForm.get('moughataa')?.setValue('');

    this.requestForm.get('commune')?.setValue('');


    this.requestForm.get('adresse')?.enable();
    this.requestForm.get('adresse')?.setValue('');

    this.requestForm.get('adresseOfContact')?.enable();
    this.requestForm.get('adresseOfContact')?.setValue('');

    this.requestForm.get('phoneNumber')?.enable();
    this.requestForm.get('phoneNumber')?.setValue('');

    this.requestForm.get('email')?.enable();
    this.requestForm.get('email')?.setValue('');
  }


  async onDropDownChangeRequerant() {
    const firstSexe = this.sexes[(this.requerant.idCivReq) - 1];
    this.sexe = firstSexe;

    this.type = this.types[(this.requerant.idTypeReq) - 1];
    this.onDropdownChangeType(this.type);

    await this.fetchRequerantLocation(this.requerant.idDecoupGeo);


    this.showButtons = true;
  }


  refreshPage() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl(currentUrl);
    });
  }

  noMatch() {
    this.requerant = {} as Requerant;
    this.showButtons = false;
    this.showCinPopUp = false;

    this.type = '';
    this.sexe = '';
    this.showExtraFields = false;


    this.wilaya = ''
    this.moughataa = '';
    this.commune = '';
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


  fetchDocTypes() {
    const url = 'http://127.0.0.1:8064/nmTypeDoc/';

    this.http.get<any>(url).subscribe(
      (response: any) => {
        this.docTypes = response.payload;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  fetchTypes() {
    const url = 'http://127.0.0.1:8064/nmType/';
    this.http.get<Type[]>(url).subscribe(
      (response: any) => {
        this.types = response.payload;
        this.type = response.payload[0];
        this.typeId = 1;
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
    this.fetchDocTypes();
  }

  constructor(private router: Router, private renderer: Renderer2,private http: HttpClient, private formBuilder: FormBuilder, private tokenService: TokenService, private titleService: Title) {

    this.requestForm.get('nni')?.valueChanges.subscribe(value => {
      
      this.enableAllFormControls();
      if (this.requestForm.get('nni')?.valid) {
        if(!this.isEditUser){
          this.fetchRequerants();
        }
        
      }
      this.isEditUser=false;
    });
  }

  ngOnInit() {
    this.items = [{ label: 'Prise en charge des requêtes' }, { label: 'Enregistrement requête', routerLink: '/app/req/a' }];
    this.filteredRequests = this.requests;
    this.fetchNomenclature();
    this.fetchUserType();
    this.titleService.setTitle('Enregistrement requête');


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
        if ((JSON.stringify(this.requerant) === '{}')||(!this.requerant)){
          this.requestForm.get('moughataa')?.enable();
        }else{
        }
        




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
if ((JSON.stringify(this.requerant) === '{}')||(!this.requerant)){
  this.requestForm.get('commune')?.enable();
}


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
      this.typeId = 2;
      this.showExtraFields = true;
    } else {
      this.typeId = 1;
      this.showExtraFields = false;
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


  fetchUserType() {
    const url = 'http://127.0.0.1:8062/whoiam';
    const headers = {
      'Authorization': 'Bearer ' + this.tokenService.getToken()
    };

    this.http.get<any>(url, { headers }).subscribe(
      (response: any) => {
        this.idEtab = response.payload.idEtab;
        this.idAdmUser = response.payload.idAdmUser;

      },
      (error) => {
        console.error(error);
      }
    );
  }



  saveRequest() {
    const requerantUrl = 'http://127.0.0.1:8101/requerant/add';
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



      this.http.post<Requerant>(requerantUrl, requerantData)
        .subscribe(
          async (response) => {
            this.requerantId = response.id;
            this.saveRequete();
          },
          (error) => {
            console.error('Error adding requerant:', error);
          }
        );

    }


  }

  saveServices() {
    const serviceUrl = 'http://127.0.0.1:8101/service/add';
    const selectedServicess = this.requestForm.get("selectedServices")?.value as unknown as any[] || [];


    if (selectedServicess) {
      for (const element of selectedServicess as any[]) {
        const serviceData = {
          idReq: this.requeteId,
          idServPub: element.id,
        };
        this.http.post<Service>(serviceUrl, serviceData)
          .subscribe(
            (response) => {
              this.refreshPage();
            },
            (error) => {
              console.error('Error adding requerant:', error);
            }
          );
      }

    }

  }

  saveRequete() {
    const dateOfRequest = this.requestForm.get("dateOfRequest")?.value;
    const formattedDateOfRequest = dateOfRequest ? this.formatDate(dateOfRequest.toString()) : '';


    const dateOfProblem = this.requestForm.get("dateOfProblem")?.value;
    const formattedDateOfProblem = dateOfProblem ? this.formatDate(dateOfProblem) : '';



    const requeteUrl = 'http://127.0.0.1:8101/requete/add';
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

    this.http.post<any>(requeteUrl, requeteData)
      .subscribe(
        (response) => {
          this.requeteId = response.id_req;
          this.saveServices();
        },
        (error) => {
          console.error('Error adding requete:', error);
        }
      );
  }

  confirmUser() {
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


  editUser() {
    this.isEditUser=true;
    this.setRequestAttributes(this.requerant);
    
    this.showButtons = false;
    this.showCinPopUp=false;


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

    this.setValueAndAddClass('nni', requerant.cin, this.renderer);
    this.setValueAndAddClass('lastName', requerant.nom, this.renderer);
    this.setValueAndAddClass('name', requerant.prenom, this.renderer);

    this.setValueAndAddClass('adresse', requerant.adresse, this.renderer);
    this.setValueAndAddClass('adresseOfContact', requerant.adresse, this.renderer);
    this.setValueAndAddClass('phoneNumber', requerant.telContact, this.renderer);
    this.setValueAndAddClass('email', requerant.emailContact, this.renderer);

    const firstSexe = this.sexes[(requerant.idCivReq) - 1];
    this.sexe = firstSexe;
    
    this.onDropdownChangeSexe(this.sexes[(requerant.idCivReq) - 1]);
    await this.fetchRequerantLocation(requerant.idDecoupGeo);




  }


  async matchRequerant() {
    this.showCinPopUp = false;
    this.showButtons = false;
    this.requestForm.controls['name'].setValue(this.requerant.prenom);
    this.requestForm.get('name')?.disable();

    this.requestForm.controls['lastName'].setValue(this.requerant.nom);
    this.requestForm.get('lastName')?.disable();

   
    this.requestForm.get('sexe')?.disable();


    this.type = this.types[(this.requerant.idTypeReq) - 1];
    this.onDropdownChangeType(this.type);
    this.requestForm.get('type')?.disable();

    if (this.requerant.idTypeReq == 2) {
      this.requestForm.controls['nniResp'].setValue(this.requerant.cinResp);
      this.requestForm.get('nniResp')?.disable();

      this.requestForm.controls['rc'].setValue(this.requerant.rc);
      this.requestForm.get('rc')?.disable();

      this.requestForm.controls['prenomResp'].setValue(this.requerant.prenomsResp);
      this.requestForm.get('prenomResp')?.disable();

      this.requestForm.controls['nomResp'].setValue(this.requerant.nomResp);
      this.requestForm.get('nomResp')?.disable();

      this.requestForm.controls['denomination'].setValue(this.requerant.denomination);
      this.requestForm.get('denomination')?.disable();
    }



    this.requestForm.controls['adresse'].setValue(this.requerant.adresse);
    this.requestForm.get('adresse')?.disable();

    this.requestForm.controls['adresseOfContact'].setValue(this.requerant.adresseContact);
    this.requestForm.get('adresseOfContact')?.disable();

    this.requestForm.controls['email'].setValue(this.requerant.emailContact);
    this.requestForm.get('email')?.disable();
    this.requestForm.controls['phoneNumber'].setValue(this.requerant.telContact);
    this.requestForm.get('phoneNumber')?.disable();


    this.requestForm.get('wilaya')?.disable();
    this.requestForm.get('moughataa')?.disable();
    this.requestForm.get('commune')?.disable();





  }


  showValidationMessage(field: string): void {
    this.requestForm.get(field)?.markAsTouched();
  }

  showErrorMessage(field: string): boolean {
    return this.requestForm.get(field)?.touched || false;
  }



}
