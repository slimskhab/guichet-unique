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
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { htmlToText } from 'html-to-text';





interface Request {
  id_req: any,
  idTypeReq: any,
  idNivUrgReq: any,
  idRequerant: any,
  idEtatReq: any,
  numReq: string,
  dtRequete: any,
  adresse: string,
  desc: string,
  datAppPb: any,
  objet: string,
  actionsEnt: string,
  f_valid: any,
  motifRejet: any,
  datLimite: string,
  idEtab: any,
  idUser: any,
  demandeur: string;
  nni: string;
  services: any[],
  servicesText: string;
  etatReq: string;
}

interface Contact {
  adrResp: string,
  emailResp: string,
  idOrg: any,
  idResp: any,
  nomResp: string,
  prenomResp: string,
  telResp: string,
  organsime: string,
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



interface Organisme {
  codeOrg: string,
  desOrgFr: string,
  idOrg: any
  idTypeOrg: any
}


@Component({
  selector: 'app-send-request',
  templateUrl: './send-request.component.html',
  styleUrls: ['./send-request.component.css']
})
export class SendRequestComponent {

  home: MenuItem = { icon: 'pi pi-home', routerLink: '/app/acc' };
  items: MenuItem[] = [];
  requestId: any;
  orgId: any;

  requerant: any;
  request: any;

  modeEnvoi = ["Email", "Courrier"];
  selectedOption: any;

  showContacts: boolean = false;
  showDocuments: boolean = false;

  selectedContacts: any[] = [];
  filteredContacts: any[] = [];
  contacts: Contact[] = [];

  showAddContactPopUp = false;

  filterValue: any;



  formGroup = this.formBuilder.group({
    description: ["", Validators.required],
    objet: ["", Validators.required],
    limitDate: ["", Validators.required],
    modeEnvoi: ["", Validators.required],
  })

  addContactForm = this.formBuilder.group({
    nom: ["", Validators.required],
    prenom: ["", Validators.required],
    email: ["", Validators.required],
    phoneNumber: ["", Validators.required],
    adresse: ["", Validators.required],
  })


  documents = [
    { type: "write", entitled: "something", id: "01" }, { type: "some type", entitled: "something", id: "05" },
  ];

  ngOnInit() {
    this.items = [{ label: 'Prise en charge des requêtes' }, { label: 'Avis et qualification', routerLink: '/app/req/lrv' }];
    const idParam1 = this.route.snapshot.paramMap.get('idreq');
    this.requestId = idParam1 ? parseInt(idParam1, 10) : 0;
    const idParam2 = this.route.snapshot.paramMap.get('idorg');
    this.orgId = idParam2 ? parseInt(idParam2, 10) : 0;

    this.titleService.setTitle('Avis et qualification');
    this.fetchRequest();
    this.fetchContacts();
    this.exportPdf();

  }



  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute, private titleService: Title, private formBuilder: FormBuilder,) {
  }







  async getRequestState() {
    const url = 'http://127.0.0.1:8064/nmEtatRequete/' + this.request.idEtatReq;
    try {
      const response = await this.http.get<any>(url).toPromise();
      if (response) {
        this.request.etatReq = response.payload.desEtatReqFr;

      }
    } catch (error) {
      console.error(error);
    }
  }

  noCheckboxSelected(): boolean {
    // Check if any checkbox is selected in the table
    return !this.selectedContacts || this.selectedContacts.length === 0;
  }

  disableButton(): boolean {
    if (this.selectedOption == "Email") {
      return this.formGroup.invalid || this.noCheckboxSelected();
    }
    else if (this.selectedOption == "Courrier") {
      return this.formGroup.invalid;
    }
    return true;

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



      }
    } catch (error) {
      console.error(error);
    }
  }


  fetchRequest() {
    const url = 'http://127.0.0.1:8101/requete/id/' + this.requestId;

    this.http.get<any>(url).subscribe(
      async (response: any) => {
        this.request = response;
        this.request.services = [];
        await this.fetchRequerant();

        this.getRequestState();
        console.log("request type is : ", this.request.etatReq);

      },
      (error) => {
        console.error(error);
      }
    );
  }

  fetchContacts() {
    const url = 'http://127.0.0.1:8064/paramRespOrg/paramRespOrgByIdOrg/' + this.orgId;

    this.http.get<any>(url).subscribe(
      async (response: any) => {
        console.log(response.payload)
        this.contacts = response.payload;
        for (const element of this.contacts) {
          element.organsime = (await this.fetchOrganismeById(element.idOrg)).desOrgFr;
        }
        this.filteredContacts = this.contacts;

      },
      (error) => {
        console.error(error);
      }
    );
  }



  async fetchOrganismeById(organismeId: number): Promise<Organisme> {
    const url = 'http://127.0.0.1:8064/rcOrg/' + organismeId;
    try {
      const response = await this.http.get<any>(url).toPromise();
      this.request.organisme = response.payload.desOrgFr;
      return response.payload;
    } catch (error) {
      console.error(error);
      throw error;
    }
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

  returnToPage() {
    this.router.navigate(['app/req/lra']);
  }


  onDropDownChange(selectedOption: any) {
    console.log(selectedOption);
    if (selectedOption == "Email") {
      this.showContacts = true;
      this.showDocuments = false;
    }
    else {
      this.showContacts = false;
      this.showDocuments = true;
    }
  }

  applyFilter() {
    this.filteredContacts = this.contacts.filter(contact =>
      contact.organsime.toString().includes(this.filterValue) ||
      contact.prenomResp.toString().includes(this.filterValue) ||
      contact.nomResp.toString().includes(this.filterValue) ||
      contact.emailResp.toString().includes(this.filterValue)
    );
  }

  addContact() {
    const url = 'http://127.0.0.1:8064/paramRespOrg/';

    const requestData = {
      adrResp: this.addContactForm.get("adresse")?.value,
      emailResp: this.addContactForm.get("email")?.value,
      idOrg: this.orgId,
      nomResp: this.addContactForm.get("nom")?.value,
      prenomResp: this.addContactForm.get("prenom")?.value,
      telResp: this.addContactForm.get("phoneNumber")?.value
    };


    this.http.post(url, requestData).subscribe(
      (response: any) => {
        this.showAddContactPopUp = false;

      },
      (error) => {
        console.error(error);
      }
    );




  }

  openAddDialog() {
    this.showAddContactPopUp = true;
  }

  exportButton() {
    console.log(this.selectedContacts);
  }

  showValidationMessage(field: string): void {
    this.formGroup.get(field)?.markAsTouched();
  }

  showErrorMessage(field: string): boolean {
    return this.formGroup.get(field)?.touched || false;
  }


  showValidationMessage2(field: string): void {
    this.addContactForm.get(field)?.markAsTouched();
  }

  showErrorMessage2(field: string): boolean {
    return this.addContactForm.get(field)?.touched || false;
  }



  updateRequest() {
    const url = 'http://127.0.0.1:8101/requete/update/' + this.requestId;

    const requestData = {
      idEtatReq: 4
    };;

    this.http.put(url, requestData).subscribe(
      (response: any) => {
        this.router.navigate(['/app/req/lra']);
      },
      (error) => {
        console.error(error);
      }
    );


  }

  exportPdf() {
    const doc = new jsPDF();
    const image = '../../assets/images/pdflogo.png';
    const pageWidth = doc.internal.pageSize.getWidth();
    const imgWidth = pageWidth;
    const imgHeight = 30;

    doc.addImage(image, 'JPEG', 0, 0, imgWidth, imgHeight, '', 'FAST');

    const currentDate = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };
    const formattedDate = currentDate.toLocaleString('fr-FR', options);

    const date = `Fait à Wilaya Nouakchott-Nord, le ${formattedDate}`;
    const dateX = pageWidth - 10; // X-coordinate for the text
    const dateY = imgHeight + 20; // Y-coordinate for the text

    doc.setFontSize(10);
    doc.text(date, dateX, dateY, { align: "right" });


    const number = `Courrier lié à la requête N° : ${this.request.numReq}`;
    const numberX = 10;
    const numberY = dateY + 10;
    doc.text(number, numberX, numberY);

    this.fetchOrganismeById(this.orgId)


    const headingText = `M. responsable ${this.request.organisme}`
    const headingX = pageWidth / 2;
    const headingY = numberY + 10;

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold');
    doc.text(headingText, headingX, headingY, { align: "center" })


    doc.setFontSize(10)
    doc.setFont('helvetica', 'regular');
    const object = `objet: ${this.formGroup.get("objet")?.value}`
    const objectX = 10;
    const objectY = headingY + 10;
    doc.text(object, objectX, objectY, { align: "left" })





    const contenu = this.formGroup.get("description")?.value || '';
    const plainTextContent = htmlToText(contenu);

    const contenuX = 10;
    const contenuY = objectY + 10;
    doc.text(plainTextContent, contenuX, contenuY, { align: "left" });






    doc.save("Courrier.pdf");
  }



}
