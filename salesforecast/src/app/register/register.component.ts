import { Component,ElementRef,ViewChild,NgModule} from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { FormBuilder, FormGroup, Validators ,FormsModule} from '@angular/forms';
import { SharedService } from '../shared/shared.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  // title = 'login.com';
  constructor(private router:Router,private formbuilder:FormBuilder,private shared:SharedService,private titleService: Title){}
  registerform!:FormGroup
  submitted=false

  loginform!:FormGroup
  login=false
  
  

ngOnInit(){
  this.titleService.setTitle('Sales forecast-login.com');
  this.registerform=this.formbuilder.group({
    username:['',[Validators.required,Validators.minLength(4)]],
    email:['',[Validators.required,Validators.email]],
    password:['',[Validators.required,Validators.minLength(6)]]
  })
  
  this.loginform=this.formbuilder.group({
    email:['',[Validators.required,Validators.email]],
    password:['',[Validators.required,Validators.minLength(6)]]
  })
}
errormessage=''

onSubmit(){
  console.log(this.registerform)
  this.submitted=true
  if(this.registerform.invalid)
  return
  this.shared.register(this.registerform.value.username,
  this.registerform.value.email,
  this.registerform.value.password)
  .subscribe({
    next:data=>{
      this.shared.storetoken(data.idToken);
      console.log("registerd id token is "+data.idToken)
      this.router.navigate(['/data'])
    },
    error:data=>{
      if(data.error.error.message=="INVALID_EMAIL"){
        this.errormessage="Invalid email";
        return
      }
      else if(data.error.error.message="EMAIL_EXISTS")
      {
      this.errormessage="Email is already exists"
      return
      }
      else{{
        this.errormessage=data.error.error.message+"!"

        return
      }
      }
    }
  })
  
}

onLogin(){
  
  console.log(this.loginform.value.password)
  this.login=true
  if(this.loginform.invalid)
  return
  this.shared.login(this.loginform.value.email,this.loginform.value.password).subscribe({
    next:data=>{
      this.shared.storetoken(data.idToken)
      console.log("login succes");
      this.router.navigate(['/data'])
    },
    error:data=>{
      if(data.error.error.message=="INVALID_PASSWORD" || data.error.error.message=="INVALID_EMAIL"){
        this.errormessage=data.error.error.message+"!"
      
        return
      }

      else{
      this.errormessage=data.error.error.message+"!"
      return
      }
    }
  })
 
}


  containerClass = '';
  imm=true
  
  onSignUpClick() {
    this.errormessage=''
    this.imm=false
    this.containerClass = 'right-panel-active';
  }
  
  onSignInClick() {
    this.errormessage=''
    this.containerClass = '';
    this.imm=true
  }
}
