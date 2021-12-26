import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { SignosVitales } from 'src/app/_model/signosVitales';
import { SignosVitalesService } from 'src/app/_service/signosVitales.service';

@Component({
  selector: 'app-signos-vitales',
  templateUrl: './signos-vitales.component.html',
  styleUrls: ['./signos-vitales.component.css']
})
export class SignosVitalesComponent implements OnInit {

  dataSource: MatTableDataSource<SignosVitales>;
  displayedColumns: string[] = ['idSignosVitales', 'paciente', 'fecha',
   'temperatura', 'pulso', 'ritmoRespiratorio', 'acciones'];
  cantidad: number;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private signosVitalesService: SignosVitalesService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.signosVitalesService.listarPageable(0 , 10).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
    });

    this.signosVitalesService.getSignosVitalesCambio().subscribe(data => {
      this.crearTabla(data);
    });

    this.signosVitalesService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      });
    });
  }

  eliminar(id: number){
    this.signosVitalesService.eliminar(id).pipe(switchMap( ()=> {
      return this.signosVitalesService.listar();
    }))
    .subscribe(data => {
      //this.dataSource = new MatTableDataSource(data);
      this.signosVitalesService.setSignosVitalesCambio(data);
      this.signosVitalesService.setMensajeCambio('SE ELIMINO');
    });
  }

  filtrar(e : any){
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  crearTabla(data: SignosVitales[]){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  mostrarMas(e: any){
    this.signosVitalesService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
    });
  }

  verificarHijos(){
    return this.route.children.length !== 0
  }

}
