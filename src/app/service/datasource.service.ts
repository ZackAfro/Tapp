import { TeamService } from './team/team.service';
import { BadInput } from './../common/bad-input';
import { NotFoundError } from './../common/not-fournd-error';
import { AppError } from './../common/app-error';
import { Http, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, } from 'rxjs';
import { map, filter, scan, catchError } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  headers;

  constructor(private url: string, private http: Http) { 
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  getAll() {
    return this.http.get(this.url)
    // .map(Response => Response.json()) if you want to map the response
    //.catchError(this.handleError)
  }

  getAllForTeam(team) {
    return this.http.get(this.url + "?team=" + team);
    // .map(Response => Response.json()) if you want to map the response
    //.catchError(this.handleError)
  }

  delete(id) {
    console.log("deleting _id: " + id);
    return this.http.delete(this.url + '/delete/' + id)
    //.catchError(this.handleError)
  }

  add(request) {
    return this.http.post(this.url + "/add", request, this.headers)
    //.catchError(this.handleError)
  }

  update(request) {
    return this.http.put(this.url + "/update", request, this.headers)
    //.catchError(this.handleError)
  }

  private handleError(error: Response) {
    if (error.status === 404)
      return Observable.throw(new NotFoundError(error.json()));

    if (error.status === 400)
      return Observable.throw(new BadInput(error.json()));

    return Observable.throw(new AppError(error.json()));
  }
}
