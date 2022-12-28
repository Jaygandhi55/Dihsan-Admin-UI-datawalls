import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Urls } from '../constants/url.constant';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProductList(page: any): Observable<any> {
    return this.http.get(Urls.base_url + Urls.product + `?page=${page}`);
  }

  getFilterProductList(params: any): Observable<any> {
    return this.http.get(Urls.base_url + Urls.product, {params: params});
  }

  getFilterProductListForDownloadImages(params: any): Observable<any> {
    let parameters = JSON.parse(JSON.stringify(params));
    parameters.page = 1;
    parameters['page_count'] = 10000;
    return this.http.get(Urls.base_url + Urls.product, {params: parameters});
  }

  syncAll(): Observable<any> {
    return this.http.post(Urls.base_url + Urls.syncAll, null);
  }

  getSupplierList(page?: any): Observable<any>{
    if(page) {
      return this.http.get(Urls.base_url + Urls.suppliers + `?page=${page}`);
    } else {
      return this.http.get(Urls.base_url + Urls.suppliers);
    }
  }

  getActiveSupplierList(page: any): Observable<any>{
      return this.http.get(Urls.base_url + Urls.suppliers + `?page=${page}&is_active=true`);
  }

  createSupplier(req: any): Observable<any>{
      return this.http.post(Urls.base_url + Urls.suppliers, req);
  }

  updateSupplier(req: any, id: any): Observable<any>{
    return this.http.patch(Urls.base_url + Urls.suppliers + `/${id}`, req);
  }

  syncSupplier(req: any): Observable<any>{
    return this.http.post(Urls.base_url + Urls.syncSupplier, req);
  }

  getDesignerList(page: any): Observable<any>{
    return this.http.get(Urls.base_url + Urls.designers + `?page=${page}`);
  }

  createDesigner(req: any): Observable<any>{
    return this.http.post(Urls.base_url + Urls.designers, req);
  }

  updateDesigner(req: any, id: any): Observable<any>{
    return this.http.patch(Urls.base_url + Urls.designers + `/${id}`, req);
  }

  getEndPointList(page?: any): Observable<any>{
    if (page) {
      return this.http.get(Urls.base_url + Urls.endpoints + `?page=${page}`);
    } else {
      return this.http.get(Urls.base_url + Urls.endpoints);
    }
  }

  createEndPointList(req: any): Observable<any>{
    return this.http.post(Urls.base_url + Urls.endpoints, req);
  }

  updateEndPointList(req: any, id: any): Observable<any>{
    return this.http.patch(Urls.base_url + Urls.endpoints + `/${id}`, req);
  }

  syncEndPoint(req: any): Observable<any>{
    return this.http.post(Urls.base_url + Urls.syncEndpoint, req);
  }

  getResourceList(page: any): Observable<any>{
    return this.http.get(Urls.base_url + Urls.resources + `?page=${page}`);
  }

  getFilterResourceList(page: any, endpoint: any, api_type: any): Observable<any>{
    return this.http.get(Urls.base_url + Urls.resources + `?page=${page}&endpoint=${endpoint}&api_type=${api_type}`);
  }

  createResourceList(req: any): Observable<any>{
    return this.http.post(Urls.base_url + Urls.resources, req);
  }

  updateResourceList(req: any, id: any): Observable<any>{
    return this.http.patch(Urls.base_url + Urls.resources + `/${id}`, req);
  }

  updateFiled(supplier: any, resource: any, page: any): Observable<any>{
    let params = new HttpParams();
    params = params.append('page', page);
    params = params.append('supplier', supplier);
    params = params.append('resource', resource);
    return this.http.get(Urls.base_url + Urls.fields_mapping, { params: params });
  }

  bulkUpdateField(req: any): Observable<any>{
    return this.http.post(Urls.base_url + Urls.bulk_update_field, req);
  }

  syncResouce(req: any): Observable<any>{
    return this.http.post(Urls.base_url + Urls.syncresouce, req);
  }

  getCategoryList(page: any): Observable<any>{
    return this.http.get(Urls.base_url + Urls.categoryList + `?page=${page}`);
  }

  getAllCategories(page: any): Observable<any>{
    return this.http.get(Urls.base_url + Urls.allCategories + `?page=${page}`);
  }

  getCategorySearchList(params: any): Observable<any>{
    return this.http.get(Urls.base_url + Urls.categoryList, {params: params});
  }

  getSubCategoryList(page: any): Observable<any>{
    return this.http.get(Urls.base_url + Urls.subcategoryList + `?page=${page}`);
  }

  getSizeList(page: any): Observable<any>{
    return this.http.get(Urls.base_url + Urls.sizeList + `?page=${page}`);
  }

  getGenderList(page: any): Observable<any>{
    return this.http.get(Urls.base_url + Urls.genderList + `?page=${page}`);
  }

  getColorList(page: any): Observable<any>{
    return this.http.get(Urls.base_url + Urls.colorList + `?page=${page}`);
  }

  getScheduleList(page: any): Observable<any>{
    return this.http.get(Urls.base_url + Urls.schedules + `?page=${page}`);
  }

  createSchedule(req: any): Observable<any>{
    return this.http.post(Urls.base_url + Urls.schedules, req);
  }

  updateSchedule(req: any, id: any): Observable<any>{
    return this.http.patch(Urls.base_url + Urls.schedules + `/${id}`, req);
  }

  getproductImageList(prodId: any): Observable<any>{
    return this.http.get(Urls.base_url + Urls.productImage + `?product=${prodId}`);
  }

  patchProductImage(req: any, id: any): Observable<any>{
    return this.http.patch(Urls.base_url + Urls.productImage + `/${id}`, req);
  }

  patchFieldMap(req: any, id: any): Observable<any>{
    return this.http.patch(Urls.base_url + Urls.product + `${id}`, req);
  }

  postProductImage(req: any): Observable<any>{
    return this.http.post(Urls.base_url + Urls.productImage, req);
  }

  postBulkUpdate(req: any): Observable<any>{
    return this.http.post(Urls.base_url + Urls.bulkUpdate, req);
  }

  deleteProductImage(id: any): Observable<any>{
    return this.http.delete(Urls.base_url + Urls.productImage + `/${id}`);
  }

  mediaLockUnlock(id: any, req: any): Observable<any>{
    return this.http.patch(Urls.base_url + Urls.product + `${id}`, req);
  }

  getFieldMapList(categoryId: any,page_count: any): Observable<any>{
    return this.http.get(Urls.base_url + Urls.categoryFieldMapping + `?category=${categoryId}&page_count=${page_count}&include_parents=true`);
  }

  getProjectConfig(): Observable<any> {
    return this.http.get(Urls.base_url + Urls.configuration);
  }

  postProjectConfig(req: any): Observable<any> {
    return this.http.post(Urls.base_url + Urls.configuration, req);
  }

  getCategoryMapping(id: any, page: any): Observable<any> {
    return this.http.get(Urls.base_url + Urls.categoryFieldMapping + `?category=${id}&page=${page}`);
  }

  deleteCategoryMapping(id: any): Observable<any> {
    return this.http.delete(Urls.base_url + Urls.categoryFieldMapping + `/${id}`);
  }

  bulkUpdateCategoryField(req: any): Observable<any>{
    return this.http.post(Urls.base_url + Urls.bulk_update_category_field, req);
  }

  updateWebID(req: any, id: any): Observable<any>{
    return this.http.patch(Urls.base_url + Urls.allCategories + `/${id}`, req);
  }

  postAssignTo(req: any): Observable<any>{
    return this.http.post(Urls.base_url + Urls.assignTo, req);
  }

  getOrderList(page: any): Observable<any> {
    return this.http.get(Urls.base_url + Urls.order + `?page=${page}`);
  }

  updateOrderDetail(id: any, req: any): Observable<any> {
    return this.http.patch(Urls.base_url + Urls.order + `/${id}`, req);
  }

}
