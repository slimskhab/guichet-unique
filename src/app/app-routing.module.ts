import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { RegisterRequestComponent } from './register-request/register-request.component';
import { RequestListComponent } from './request-list/request-list.component';
import { AvRequestListComponent } from './av-request-list/av-request-list.component';
import { VerifyRequestComponent } from './verify-request/verify-request.component';
import { LraRequestListComponent } from './lra-request-list/lra-request-list.component';
import { SendRequestComponent } from './send-request/send-request.component';
import { ViewRequestComponent } from './view-request/view-request.component';
import { ModifyRequestComponent } from './modify-request/modify-request.component';


const routes: Routes = [

    { path: 'app/acc', component: HomePageComponent },
    {path: 'app/req/a',component: RegisterRequestComponent},
    {path: 'public/authentification/login', component: LoginComponent},
    {path: 'app/req/lr', component: RequestListComponent},
    {path: 'app/req/lrv', component: AvRequestListComponent},
    { path: 'app/req/vld/:id', component: VerifyRequestComponent },
    { path: 'app/req/lra', component: LraRequestListComponent },
    { path: 'app/req/env/:idreq/:idorg', component: SendRequestComponent },
    { path: 'app/req/lr/d/:idreq', component: ViewRequestComponent },
    { path: 'app/req/m/:idreq', component: ModifyRequestComponent }




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
