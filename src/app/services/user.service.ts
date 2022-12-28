import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Urls } from '../constants/url.constant';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  roleList: any = null;
  userDetails: any = null;
  roleAccessRights: any = null;

  constructor(private http: HttpClient) { }

  changeLoginPassword(req: any): Observable<any>{
    return this.http.post(Urls.base_url + Urls.change_password, req);
  }

  getUsersList(page: any): Observable<any>{
    return this.http.get(Urls.base_url + Urls.userList + `?page=${page}`);
  }

  getUsersListRoleBase(role__name: any): Observable<any>{
    return this.http.get(Urls.base_url + Urls.userList + `?role__name=${role__name}`);
  }

  getRoleList(page?: any): Observable<any>{
    if (page) {
      return this.http.get(Urls.base_url + Urls.roleList + `?page=${page}`);
    } else {
      return this.http.get(Urls.base_url + Urls.roleList);
    }
  }

  updateUser(req: any, id: any): Observable<any>{
    return this.http.patch(Urls.base_url + Urls.updateUser + id, req);
  }

  createUser(req: any): Observable<any>{
    return this.http.post(Urls.base_url + Urls.updateUser, req);
  }

  getRoleAccess(req: any): Observable<any>{
    return this.http.post(Urls.base_url + Urls.getRoleAccess, req);
  }

  updateRoleAccess(req: any): Observable<any>{
    return this.http.post(Urls.base_url + Urls.updateRoleAccess, req);
  }
}
