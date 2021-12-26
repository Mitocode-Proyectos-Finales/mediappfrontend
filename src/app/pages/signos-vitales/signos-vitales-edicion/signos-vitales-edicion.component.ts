import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Paciente } from 'src/app/_model/paciente';
import { SignosVitales } from 'src/app/_model/signosVitales';
import { PacienteService } from 'src/app/_service/paciente.service';
import { SignosVitalesService } from 'src/app/_service/signosVitales.service';

@Component({
  selector: 'app-signos-vitales-edicion',
  templateUrl: './signos-vitales-edicion.component.html',
  styleUrls: ['./signos-vitales-edicion.component.css']
})
export class SignosVitalesEdicionComponent implements OnInit {

  id: number = 0;
  edicion: boolean = false;
  form: FormGroup;
  pacientes: Paciente[];
  pacienteSeleccionado: Paciente;
  fechaSeleccionada: Date = new Date();
  maxFecha: Date = new Date();

  myControlPaciente: FormControl = new FormControl();
  pacientesFiltrados$: Observable<Paciente[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private signosVitalesService: SignosVitalesService,
    private pacienteService: PacienteService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'id': new FormControl(0),
      'paciente': this.myControlPaciente,
      'fecha': new FormControl(new Date()),
      'temperatura': new FormControl(''),
      'pulso': new FormControl(''),
      'ritmoRespiratorio': new FormControl('')
    });

    this.listarPacientes();
    this.pacientesFiltrados$ = this.myControlPaciente.valueChanges.pipe(
      map(val => this.filtrarPacientes(val)));

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.initForm();
    });
  }

  initForm() {
    if (this.edicion) {
      this.signosVitalesService.listarPorId(this.id).subscribe(data => {
        this.form = new FormGroup(
          {
            'id': new FormControl(data.idSignosVitales),
            'paciente': new FormControl(data.paciente),
            'fecha': new FormControl(data.fecha),
            'temperatura': new FormControl(data.temperatura),
            'pulso': new FormControl(data.pulso),
            'ritmoRespiratorio': new FormControl(data.ritmoRespiratorio)
          }
        );
      });
    }
  }

  filtrarPacientes(val: any) {
    if (val != null && val.idPaciente > 0) {
      return this.pacientes.filter(el =>
        el.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || el.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || el.dni.includes(val.dni)
      );
    }
    return this.pacientes.filter(el =>
      el.nombres.toLowerCase().includes(val?.toLowerCase()) || el.apellidos.toLowerCase().includes(val?.toLowerCase()) || el.dni.includes(val)
    );
  }

  mostrarPaciente(val: any) {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }

  listarPacientes() {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }

  operar() {
    let signosVitales = new SignosVitales();
    signosVitales.idSignosVitales = this.form.value['id'];
    signosVitales.paciente = this.form.value['paciente'];
    signosVitales.fecha = moment(this.form.value['fecha']).format('YYYY-MM-DDTHH:mm:ss');
    signosVitales.temperatura = this.form.value['temperatura'];
    signosVitales.pulso = this.form.value['pulso'];
    signosVitales.ritmoRespiratorio = this.form.value['ritmoRespiratorio'];

    if (this.edicion) {
      this.signosVitalesService.modificar(signosVitales).pipe(switchMap(() => {
        return this.signosVitalesService.listar();
      }))
      .subscribe(data => {
        this.signosVitalesService.setSignosVitalesCambio(data);
        this.signosVitalesService.setMensajeCambio('SE REGISTRO');
      });
    } else {
      this.signosVitalesService.registrar(signosVitales).pipe(switchMap(() => {
        return this.signosVitalesService.listar();
      }))
      .subscribe(data => {
        this.signosVitalesService.setSignosVitalesCambio(data);
        this.signosVitalesService.setMensajeCambio('SE REGISTRO');
      });
    }

    this.router.navigate(['/pages/signos-vitales']);

  }

}
