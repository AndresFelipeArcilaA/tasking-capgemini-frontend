import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private url = "http://localhost:8282/api/v1/tasking/gestion-tareas";


  constructor(private httpClient: HttpClient) { }

  public getTask(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.url + "/tareas");
  }

  public getTaskById(id: number): Observable<any> {
    return this.httpClient.get<any>(`${this.url}?id=${id}`);
  }

  public saveTask(task: any) : Observable<any>{
    return this.httpClient.post<any>(this.url, task)
  }

  public deletedTask(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.url}?id=${id}`);
  }

  public updateTask(task:any): Observable<any>{
    return this.httpClient.put<any>(this.url, task)
  }
}
