import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SharedService {
  
constructor(private http:HttpClient,private router:Router){}
public  array:Subject<any[]>=new BehaviorSubject<any[]>([]);

  isauthenticated():boolean{
    if(sessionStorage.getItem('token')!==null){
      return true
    }

    return false
  }
  canaccess(){
    if(!this.isauthenticated())
    this.router.navigate(['/register'])
  }

  register(name:string,email:string,password:string){
    return this.http.post<{idToken:string}>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCUijIWNR3ecjGtBLeKKXuXO1rX7qThkTc',
    {displayname:name,email,password}
    );
  }

  login(email:string,password:string){

    return this.http.post<{idToken:string }>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCUijIWNR3ecjGtBLeKKXuXO1rX7qThkTc',
    {email,password
    })
  }

  storetoken(token:string){
      sessionStorage.setItem('token',token);
  }
}
