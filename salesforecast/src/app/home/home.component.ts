import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterComponent } from '../register/register.component';
// import { RegisterComponent } from './register.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  // @ViewChild(RegisterComponent);
  constructor(private router:Router){
  }

  scrollTo(elementId:string):void{
    const element=document.getElementById(elementId);
    if(element){
      element.scrollIntoView({behavior:'smooth',block:'start'});
    }
  }
  go(){
    this.router.navigate(['/register']);
  }


}
