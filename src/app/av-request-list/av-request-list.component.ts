import { Component,ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MenuItem ,PrimeNGConfig} from 'primeng/api';

import { Table } from 'primeng/table';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TokenService } from '../shared/token.service';
import { DatePipe } from '@angular/common';
import { Title } from '@angular/platform-browser';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface State {
  desEtatReqAr: string,
  codeEtatReq: string,
  id: any,
  desEtatReqFr: string,
}

interface Request{
  id_req:any,
  idTypeReq:any,
  idNivUrgReq:any,
  idRequerant:any,
  idEtatReq:any,
  numReq:string,
  dtRequete:any,
  adresse:string,
  desc:string,
  datAppPb:any,
  objet:string,
  actionsEnt:string,
  f_valid:any,
  motifRejet:any,
  datLimite:string,
  idEtab:any,
  idUser:any,
  demandeur:string;
  nni:string;
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


@Component({
  selector: 'app-av-request-list',
  templateUrl: './av-request-list.component.html',
  styleUrls: ['./av-request-list.component.css']
})
export class AvRequestListComponent {
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/app/acc' };
  items: MenuItem[] = [];

  @ViewChild('dt1', { static: false }) table!: Table;


  state: any;
  states: State[] = [];

  services: Service[] = [];
  service: any;

  requests: Request[]=[];
  filteredRequests: Request[]=[];
  filterValue:string='';

  ngOnInit() {
    this.items = [{ label: 'Prise en charge des requêtes' }, { label: 'Avis et qualification', routerLink: '/app/req/lrv' }];
    this.fetchNomenclature();
    this.titleService.setTitle('Avis et qualification');

    this.config.setTranslation({
      accept: 'Accept',
      reject: 'Cancel',
      startsWith: 'Commence avec',
      contains: "Contient",
      notContains: "Ne contient pas",
      endsWith: "Se termine par",
      equals: "Équivaut à",
      notEquals: "Pas égal",
      noFilter: "Pas de filtre",
      lt: "Moins que",
      lte: "Inférieur ou égal à",
      gt: "Plus grand que",
      gte: "Plus grand ou égal à",
      is: "Est",
      isNot: "N'est pas",
      before: "Avant",
      after: "Aprés",
      dateIs: "La date est",
      dateIsNot: "La date n'est pas",
      dateBefore: "La date est antérieure",
      dateAfter: "La date est après",
      clear: "Effacer",
      apply: "Appliquer",
      matchAll: "Correspondre à tous",
      matchAny: "Correspondre à n'importe quel",
      addRule: "Ajouter une règle",
      removeRule: "Supprimer la règle",
      choose: "Choose",
      upload: "Upload",
      cancel: "Cancel",
      dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      dayNamesMin: ["Su","Mo","Tu","We","Th","Fr","Sa"],
      monthNames: ["January","February","March","April","May","June","July","August","September","October","November","December"],
      monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      dateFormat: "mm/dd/yy",
      today: "Today",
      weekHeader: "Wk",
      weak: "Weak",
      medium: "Medium",
      strong: "Strong",
      passwordPrompt: "Enter a password",
      emptyMessage: "No results found",
      emptyFilterMessage: "No results found"
      //translations
  });

  }
  constructor(private http: HttpClient, private titleService: Title,private config: PrimeNGConfig) {

  }




  fetchNomenclature() {
    this.fetchState();
    this.fetchRequests();
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

  async fetchRequerantFullName(request: any): Promise<Request> {
    const url = `http://127.0.0.1:8101/requerant/id/${request.idRequerant}`;
    let fullName: string = "";
    let nni:string="";
  
    try {
      const response: any = await this.http.get(url).toPromise();
  
      if (response.code == 200) {
        fullName = response.payload.nom + " " + response.payload.prenom;
        nni=response.payload.cin;
      }
  
      request.demandeur=fullName;
      request.nni=nni;
      return request;
    } catch (error: any) {
      console.error('Error:', error);
      return request;
    }
  }


  fetchRequests(){
    const url = 'http://127.0.0.1:8101/requete/list?idEtatReq=1';
    this.http.post<Request[]>(url,null).subscribe(
      (response: Request[]) => {
        console.log("response is : ",response);
        this.requests = response;
        this.requests.forEach(async request => {
          request.datAppPb = new Date(request.datAppPb);
          request.dtRequete = new Date(request.dtRequete);
          this.fetchRequerantFullName(request);
        });

        this.filteredRequests = this.requests;


      },
      (error) => {
        console.error(error);
      }
    );
  }

  fetchState() {
    const url = 'http://127.0.0.1:8064/nmEtatRequete/';

    this.http.get<State[]>(url).subscribe(
      (response: any) => {

        this.states = response.payload;

      },
      (error) => {
        console.error(error);
      }
    );
  }


  clear(table: Table) {
    table.clear();
}


applyFilter() {
  this.filteredRequests = this.requests.filter(request =>
    request.numReq.toString().includes(this.filterValue) ||
    request.dtRequete.toString().includes(this.filterValue) ||
    request.datAppPb.toString().includes(this.filterValue)||request.demandeur.toLowerCase().includes(this.filterValue.toLowerCase())||
    
    request.objet.toLowerCase().includes(this.filterValue) 
  );
}

applyNniFilter() {
  this.filteredRequests = this.requests.filter(request => 
    request.nni.toLowerCase().includes(this.filterValue) 
  );
}

exportPdf() {
  const doc = new jsPDF();
  const data = this.table.filteredValue || this.table.value;

  const columns = [
    { header: 'N° requête' },
    { header: 'Date requête' },
    { header: 'Organisme' },
    { header: 'Demandeur' },
    { header: 'Date apparition' }
  ];

  const rows = data.map((request: any) => ({
    numReq: request.numReq,
    dtRequete: this.formatDate(request.dtRequete),
    organisme: request.organisme,
    demandeur: request.demandeur,
    datAppPb: this.formatDate(request.datAppPb)
  }));

  const image = '../../assets/images/pdfimage.png'; // Replace with the actual path to your image

  // Add the image
  const pageWidth = doc.internal.pageSize.getWidth();
  const imgWidth = pageWidth;
  const imgHeight = 30;

  // Add the image
  doc.addImage(image, 'JPEG', 0, 0, imgWidth, imgHeight, '', 'FAST');
  // Set the position for the table below the image
  const tableY = 90 // Add some spacing between the image and the table

  // Set font style for the heading
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);

  // Add the heading text
  const headingText = 'Liste des requêtes en cours de validation';
  const headingX = pageWidth / 2; // Center align the heading
  const headingY = imgHeight+20; // Adjust the Y coordinate to position the heading above the table
  doc.text(headingText, headingX, headingY, { align: 'center' });

  // Set font style for the additional text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);

  // Calculate the height of the heading text
  const headingHeight = doc.getTextDimensions(headingText).h;

  // Add the additional text
  const dateText = `Mauritanie le ${new Date().toLocaleDateString()}`;
  const dateX = pageWidth - 10; // Adjust the X coordinate to align the text to the right
  const dateY = headingY + headingHeight + 5; // Adjust the Y coordinate to position the text below the heading
  doc.text(dateText, dateX, dateY, { align: 'right' });

  // AutoTable plugin to generate PDF table
  (doc as any).autoTable({
    columns: columns.map(column => column.header),
    body: rows.map((row: any) => Object.values(row)),
    startY: 60,
    theme: 'grid', // Add grid theme to the table
    styles: {
      headerFillColor: [11, 105, 58], // Set the header column color using RGB values
      halign: 'center' // Center align the header text
    },
    headerStyles: {
      fillColor: [11, 105, 58], // Set the header row color using RGB values
      textColor: [255, 255, 255], // Set the header text color to white
      fontStyle: 'bold' // Set the header font style to bold
    },
    margin: { top: 10, bottom: 10 } // Add margin to the table
  });

  doc.save("Liste des requêtes en cours de validation.pdf");
}






formatDate(date: string): string {
  const formattedDate = new Date(date);
  return formattedDate.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}
}
