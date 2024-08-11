import { Component, OnInit } from '@angular/core';
import { TaskService } from './services/task.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService]
})
export class AppComponent implements OnInit {
  public modalCreated:boolean = false;
  public taskListPending : any;
  public taskListCompleted : any;
  public registerForm! : FormGroup;
  public mode : string = "CREAR";
  public titleModal! : string;
  public editTask: any;
  public draggedTask: any;
  
  constructor(private taskService: TaskService, private fb: FormBuilder, private messageService: MessageService, private confirmationService: ConfirmationService) { }
  
  ngOnInit(): void {
    this.findAll();
    this.formInit();
  }

  public formInit(){
    this.registerForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      id:['']
      
    })
  }

  public showModal(){
    this.mode = "CREAR";
    this.modalCreated = true;
    this.registerForm.reset();
  }

  public hidenModal(){
    this.modalCreated = false;
  }

  public findAll(){
    this.taskService.getTask().subscribe({
      next:(data)=>{
        this.taskListPending = data.filter((item) => item.status == 'PENDING')
        this.taskListCompleted = data.filter((item) => item.status != 'PENDING')
      }
    })
  }

  public confirmForm(){
    if(this.mode == "CREAR"){
      this.saveTask();
    }else{
      this.updateTask();
    }
  }
  public saveTask(){
    let data = {
      title: this.registerForm.value.title.toUpperCase().trim(),
      description: this.registerForm.value.description.trim(),
      status: "PENDING",
      createdAt: this.getCurrentDate()
    }
    this.taskService.saveTask(data).subscribe({
      next:()=>{
        this.findAll()
        this.hidenModal()
        this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Se guardo correctamente' });
      }
      
    })
  }

  public getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }

  public deletedTask(id:number){
    this.taskService.deletedTask(id).subscribe({
      next:()=>{
        this.findAll();
        this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Se elimino correctamente' });
      }
    })
  }

  public updateTask(){
    let data = {
      title: this.registerForm.value.title.toUpperCase().trim(),
      description: this.registerForm.value.description.trim(),
      id: this.registerForm.value.id
    }
    this.taskService.updateTask(data).subscribe({
      next:()=>{
        this.findAll()
        this.hidenModal()
        this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Se actualizo correctamente' });
      }
    })
  }

  public getDetail(task:any){
    
    this.mode = "EDITAR"
    this.editTask = task
    this.registerForm.controls['title'].setValue(task.title)
    this.registerForm.controls['description'].setValue(task.description)
    this.registerForm.controls['id'].setValue(task.id)
    this.modalCreated = true
    
    
  }

  dragStart(task: any) {
    this.draggedTask = task;
}

drop() {
    if (this.draggedTask) {
      let data = {
        ...this.draggedTask,
        status:"COMPLETED"
      }
      this.taskService.updateTask(data).subscribe({
        next:()=>{
          this.findAll()
          this.hidenModal()
          this.draggedTask = null
        }
      })
    }
}

dragEnd() {
    this.draggedTask = null;
}

confirm1(id:number) {
  this.confirmationService.confirm({
      message: 'Esta seguro que quiere eliminar la tarea?',
      header: 'Eliminar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.messageService.add({ severity: 'info', summary: 'Exito', detail: 'Se elimino correctamente' });
          this.deletedTask(id)
      },
  });
}
  
}
