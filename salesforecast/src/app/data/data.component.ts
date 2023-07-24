
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../shared/shared.service';
import Chart from 'chart.js/auto';
import { Component,ElementRef,ViewChild,NgModule} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators ,FormsModule} from '@angular/forms';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent {
  // constructor(private router:Router){}

  file: any | undefined;
  periodicity: string = '';
  period: string = '';
  
  
  constructor(private http: HttpClient,private ser:SharedService,private router:Router,private formbuilder:FormBuilder,private titleService: Title) {}
 


  predict!:FormGroup
  pred=false
  
  

ngOnInit(){
  this.titleService.setTitle('Sales forecast-data.com');

  this.ser.canaccess();
  this.predict=this.formbuilder.group({
    file1:['',Validators.required],
    sele:['',Validators.required],
    time:['',Validators.required]
  })
}
spinner=false
  
  onFileSelected(event: any): void {
    this.file = event.target.files[0];
  }
  pop=false
  @ViewChild('myButton') myButton: ElementRef;
  showback=true
  closeModal() {

    this.onSubmit()
      this.spinner=true
    if(this.pop){
    this.myButton.nativeElement.setAttribute("data-dismiss", "modal");
    this.showback=false
    setTimeout(() => {
      this.spinner=false
    }, 2500);
    }
  }


  onSubmit(){
    
    this.pred=true
    if(this.predict.invalid)
    return

    
    const formData = new FormData();
    this.pop=true
    formData.append('file', this.file);
    formData.append('periodicity', this.periodicity);
    formData.append('period', this.period);
    this.http.post('http://localhost:5000/', formData)
      .subscribe((response: any) => {
        // if(this.periodicity!=='ma'){
        // const formattedData = response[0].data1.map(item => ({
        //   date: new Date(item.date).toLocaleDateString(),
        //   sales: item.sales
        // }));
        // console.log(typeof(formattedData));
        // console.log(formattedData);
        // }else{
        //   const formattedData = response.map(item => ({
        //     date: (item.date.day+"/"+item.date.month+"/"+ item.date.year),
        //     sales: item.sales
        //   }));
        //   console.log(typeof(response));
        //   console.log(formattedData);
        // }
        // console.log(response)
        this.extract(response)
      }, (error: any) => {
        console.error(error);
      });
  
  
  }
  
  arr:any [] =[]
  chartarr:any[]=[]
  old_x: any []=[]
  old_y: any []=[]
  new_x: any []=[]
  new_y: any []=[]
  col=false
  ls:any=''
  
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartCanvas1') chartCanvas1!: ElementRef<HTMLCanvasElement>;
  
  extract(response){
  for(let i=0;i<2;i++){
    var s=JSON.parse(response[0].data1);
    
    if(i==1){
       s=JSON.parse(response[i].data2);
    }
  
    // if(this.periodicity!=='D'){
    //   const formattedData = s.map(item => ({
    //     date: new Date(item.date).toLocaleDateString(),
    //     sales: item.sales
    //   }));
    //   console.log(typeof(formattedData));
    //   console.log(formattedData);
    //   }else{
    //     const formattedData = s.map(item => ({
    //       date:  new Date(item.date).toLocaleDateString(),
    //       sales: item.sales
    //     }));
    //     console.log(typeof(formattedData));
    //     console.log(formattedData);
    //   }
    if(this.periodicity!="Y"){
    const formattedData = s.map(item => ({
  
      date: new Date(item.date).toLocaleDateString(),
      sales: item.sales
    }));
    // console.log(formattedData);
    this.arr[i]=formattedData
    console.log(this.arr[i])
    
  }
  else{
    const formattedData = s.map(item => ({
      // date: new Date(item.date).toLocaleDateString(),
      date:   new Date(item.date).getFullYear().toString(),
      sales: item.sales
    }));
    // console.log(formattedData);
    this.arr[i]=formattedData
    console.log(this.arr[i ])
  }
  
  }
  
  const data1 = this.arr[0];
  
  const data2 = this.arr[1];
    
  data1.forEach((item) => {
    this.old_x.push(item.date);
    this.old_y.push(item.sales);
  });
  
  data2.forEach((item) => {
    this.new_x.push(item.date);
    this.new_y.push(item.sales);
  });
  this.ls=this.new_x[this.new_x.length-1]
  if(this.periodicity=="D"){
    console.log(this.old_x)
    for(let i=0;i < this.old_x.length;i++){
      const parts = this.old_x[i].split('/')
      const date = (parseInt(parts[0], 10)).toString()
      this.old_x[i]=date
  
      this.new_x[i]=(i+1).toString()
    }
  
  }
  
  if(this.periodicity=="M"){
    for(let i=0;i < this.old_x.length;i++){
      const parts = this.old_x[i].split('/')
      const date = (parseInt(parts[1], 10)).toString()
      this.old_x[i]=date
  
      this.new_x[i]=(i+1).toString()
    }
  
  
  }
  if(this.periodicity=="Y"){
    console.log(this.ls)
    this.new_x[0]=(parseInt(this.ls)+1).toString()
    console.log(this.new_x[0])
    var d=parseInt(this.new_x[0])
    for(let i=1;i<this.new_x.length;i++){
      
      this.new_x[i]=(d+1).toString()
      console.log(this.new_x[i])
      d=parseInt(this.new_x[i])
    }
    
  }
    this.chartarr.push(this.old_x)
    this.chartarr.push(this.old_y)
    this.chartarr.push(this.new_x)
    this.chartarr.push(this.new_y)

    console.log(this.old_x)
      const chart = new Chart(this.chartCanvas.nativeElement, {
        type: 'line',
        data: {
          labels: this.old_x,
          datasets: [{
            label: 'OLD SALES',
            data:this.old_y,
            fill: false,
            borderColor: 'orange',
            tension: 0.05
          }]
        },
        options: {
          scales:{
            x:{
              title:{
                display:true,
                text:"PERIODS",color:'rgb(70, 148, 221)'
              }
            },y:{
              title:{
                display:true,
                text:"SALES",color:'rgb(70, 148, 221)'
              }
            }
          }
        }
      });
  
      const chart1 = new Chart(this.chartCanvas1.nativeElement, {
        type: 'line',
        data: {
          labels: this.new_x,
          datasets: [{
            label: 'NEW SALES',
            data:this.new_y,
            fill: false,
            borderColor: 'rgb(70, 148, 221)',
            tension: 0.05
          }]
        },
        options: {
          scales:{
            x:{
              title:{
                display:true,
                text:"PERIODS",color:'orange'
              }
            },y:{
              title:{
                display:true,
                text:"SALES",color:'orange'
              }
            }
          }
        }
      });
        this.col=true
    }
  

    // console.log(this.chartarr)
    // this.ser.array.next(this.chartarr)

  }


