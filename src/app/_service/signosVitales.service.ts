import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'; //ReactiveX -> JS RxJS | Java RxJava || ProjectReactor Webflux
import { environment } from 'src/environments/environment';
import { SignosVitales } from '../_model/signosVitales';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class SignosVitalesService extends GenericService<SignosVitales> {

  private signosVitalesCambio: Subject<SignosVitales[]> = new Subject<SignosVitales[]>();
  private mensajeCambio: Subject<string> = new Subject<string>();

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/signosVitales`);
  }

  listarPageable(p: number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  getSignosVitalesCambio(){
    return this.signosVitalesCambio.asObservable();
  }

  setSignosVitalesCambio(lista: SignosVitales[]){
    this.signosVitalesCambio.next(lista);
  }

  getMensajeCambio(){
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(msj: string){
    this.mensajeCambio.next(msj);
  }
}
