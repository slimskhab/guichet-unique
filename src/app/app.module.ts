import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PanelMenuModule } from 'primeng/panelmenu';
import { DropdownModule } from 'primeng/dropdown';
import { RegisterRequestComponent } from './register-request/register-request.component';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DialogModule } from 'primeng/dialog';
import { HttpClientModule } from '@angular/common/http';
import { InputTextareaModule } from 'primeng/inputtextarea';

import { InputNumberModule } from 'primeng/inputnumber';

import { TableModule } from 'primeng/table';

import { SliderModule } from 'primeng/slider';
import { EditorModule } from 'primeng/editor';

import { ProgressBarModule } from 'primeng/progressbar';
// For dynamic progressbar demo
import { ToastModule } from 'primeng/toast';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { RequestListComponent } from './request-list/request-list.component';
import { TopbarComponent } from './shared/topbar/topbar.component';
import { AvRequestListComponent } from './av-request-list/av-request-list.component';
import { VerifyRequestComponent } from './verify-request/verify-request.component';
import { SendRequestComponent } from './send-request/send-request.component';
import { LraRequestListComponent } from './lra-request-list/lra-request-list.component';
import { ViewRequestComponent } from './view-request/view-request.component';
import { ModifyRequestComponent } from './modify-request/modify-request.component';





@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomePageComponent,
    RegisterRequestComponent,
    SidebarComponent,
    RequestListComponent,
    TopbarComponent,
    AvRequestListComponent,
    VerifyRequestComponent,
    SendRequestComponent,
    LraRequestListComponent,
    ViewRequestComponent,
    ModifyRequestComponent,
  ],
  imports: [
    DropdownModule,
    HttpClientModule,
    ReactiveFormsModule,
    EditorModule,
    ProgressBarModule,
    DialogModule,
    SliderModule,
    ToastModule,
    InputTextareaModule,
    CalendarModule,
    MultiSelectModule,
    BreadcrumbModule,
    InputNumberModule,
    BrowserModule,
    PanelMenuModule,
    ProgressSpinnerModule,
    BrowserAnimationsModule,
    TableModule,
    InputTextModule,
    MessageModule,
    MessagesModule,
    FormsModule,
    DividerModule,
    ButtonModule,
    RouterModule.forRoot([
      { path: '', redirectTo: 'public/authentification/login', pathMatch: 'full' },
      { path: 'public/authentification/login', component: LoginComponent },
      { path: 'app/acc', component: HomePageComponent },
      { path: 'app/req/a', component: RegisterRequestComponent },
      { path: 'app/req/lr', component: RequestListComponent },
      { path: 'app/req/lrv', component: AvRequestListComponent },
      { path: 'app/req/vld/:id', component: VerifyRequestComponent },
      { path: 'app/req/lra', component: LraRequestListComponent },
      { path: 'app/req/env/:idreq/:idorg', component: SendRequestComponent },
      { path: 'app/req/lr/d/:idreq', component: ViewRequestComponent },
      { path: 'app/req/m/:idreq', component: ModifyRequestComponent }



    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
