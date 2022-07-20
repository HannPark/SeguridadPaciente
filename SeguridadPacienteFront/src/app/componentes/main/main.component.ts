import { Component, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { MainService } from 'src/app/servicios/main.service';
import { BaseFormComponent } from 'src/app/componentes/baseComponent';
import { Demo } from 'src/app/modelos/demo/demo';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import { ComboService } from 'src/app/servicios/combo/combo.service';
import {FormBuilder,FormControl,FormGroup,Validators,} from '@angular/forms';
import { Combo } from 'src/app/modelos/combos/combo';
import { FormMasterService } from 'src/app/servicios/Formulario master/form-master.service';
import * as moment from 'moment';
import { InfoComponent } from '../info/info.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogMainComponent } from '../dialog-main/dialog-main.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent extends BaseFormComponent implements OnInit  {
  datos: Demo = new Demo();
  imagen: any = null;

  //combos
  novedades!: Combo[];
  sedes!: Combo[];
  empresas!: Combo[];
  identificaciones!: Combo[];
  servicios!: Combo[];

  //cargar daños o testigos
  hayDanos = false;
  hayTestigos = false;


  //autocompletar
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  testigos: any = [];

  form = new FormGroup({
    Fecha_Incidente:  new FormControl('', [
      Validators.required,
    ]),
    Hora_Incidente:  new FormControl('', [
      Validators.required,
    ]),
    Nombre_Quien_Reporta:  new FormControl('', [
      Validators.maxLength(80),
      Validators.pattern(this.latin),
    ]),
    Cargo_Quien_Reporta: new FormControl('', [
      Validators.maxLength(40),
      Validators.pattern(this.latin),
    ]),
    Empresa:  new FormControl('', [
      Validators.required
    ]),
    Sede:  new FormControl('', [
      Validators.required
    ]),
    Servicio_Id:  new FormControl('', [
      Validators.required
    ]),
    Nombre_Paciente:  new FormControl('', [
      Validators.required,
      Validators.maxLength(80),
      Validators.pattern(this.latin),
    ]),
    Tipo_Id:  new FormControl('', [
      Validators.required,
    ]),
    Numero_Id:  new FormControl('', [
      Validators.required,
      Validators.maxLength(11),
      Validators.pattern(this.latin),
    ]),
    Sexo:  new FormControl('', [
      Validators.required
    ]),
    Edad:  new FormControl('', [
      Validators.required
    ]),
    Tipo_Novedad:  new FormControl('', [
      Validators.required
    ]),
    Preg_Que:  new FormControl('', [
      Validators.required,
      Validators.maxLength(300),
      Validators.pattern(this.latin),
    ]),
    Preg_Como:  new FormControl('', [
      Validators.required,
      Validators.maxLength(500),
      Validators.pattern(this.latin),
    ]),
    Preg_Hay_Testigos:  new FormControl(Boolean, [
      Validators.required
    ]),
    Preg_Quien:  new FormControl('', []),
    Preg_En_Atencion:  new FormControl('', [
      Validators.required
    ]),
    Preg_Involuntario:  new FormControl(false, [
      Validators.required
    ]),
    Preg_Genero_Dano:  new FormControl(false, [
      Validators.required
    ]),
    Preg_Dano_Generado:  new FormControl('', [
      Validators.maxLength(300),
      Validators.pattern(this.latin),
    ]),
    Preg_Dano_Severidad:  new FormControl('', []),
    Accion_Tomada:  new FormControl('', [
      Validators.required,
      Validators.maxLength(500),
      Validators.pattern(this.latin),
    ]),
    Imagen_Evidencia:  new FormControl(null, []),
    Imagen_Archivo:  new FormControl(null, []),
  });

  maxDate: Date;

  constructor(
    private FormularioService: FormMasterService,
    public comboService: ComboService,
    public mainService: MainService,
    public dialog: MatDialog
  ) {
    super();
    this.maxDate = new Date();
  }

  ngAfterViewInit(): void {
    this.cargaEmpresas();
    this.cargaIdentificaciones();
    this.cargaNovedades();
    this.cargaServicios();
  }

  ngOnInit(): void {}

  submit(): void {
    this.loadingMain = true;
    console.log(this.form.value)
    if (this.form.valid) {
      this.form.disable()
      this.loadingMain = true;

      //testigos
      let string;
      string = new String(this.testigos)
      string = string.replace(/,/g, ';');
      this.form.value.Preg_Quien = string;

      //fecha
      let date = moment(this.form.value.Fecha_Incidente);
      date.locale('es')
      this.form.value.Fecha_Incidente = date.format('YYYY-MM-DD')

      this.FormularioService.create(this.form.value).subscribe({
        next: (req) => {
          console.log(req)
          this.loadingMain = false;
          this.mainService.showToast('Creado Correctamente');
          this.dialog.open(DialogMainComponent, {
            disableClose: false,
            width: '300px',
            data: {
              response: req,
              message: 'Formualario registrado exitosamente'
            }
          })
          .afterClosed()
          .subscribe((confirmado: Boolean) => {
            if (confirmado) {
            }
          });
        },
        error: (err: string) => {
          console.log(err)
          this.loadingMain = false;
          this.mainService.showToast(err, 'error');
        },
        complete: () => {
          this.loadingMain = false;
          this.testigos = [];
          this.form.reset();
          this.form.enable();
        },
      });

    }
  }

  info_Novedad(){
    let data: any = {
      title: 'Información',
      message: 'Información de novedad blablablabla'
    }
    const dialogRef = this.dialog.open(InfoComponent, {
      width: '250px',
      data: data,
      disableClose: false
    });
    dialogRef.afterClosed().subscribe((result: any) => {
    });
  }

  info_Severidad(){
    let data: any = {
      title: 'Información',
      message: 'Información de la severidad blablablabla'
    }
    const dialogRef = this.dialog.open(InfoComponent, {
      width: '250px',
      data: data,
      disableClose: false
    });
    dialogRef.afterClosed().subscribe((result: any) => {
    });
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.testigos.push(value);
    }
    event.chipInput!.clear();
  }

  remove(t: any): void {
    const index = this.testigos.indexOf(t);
    if (index >= 0) {
      this.testigos.splice(index, 1);
    }
  }

  cargaIdentificaciones(){
    this.comboService.getIdentificacion().subscribe((data:any)=>{
      this.identificaciones = data;
    });
  }

  cargaServicios(){
    this.comboService.getServicios().subscribe((data:any)=>{
      this.servicios = data;
    });
  }

  cargaNovedades(){
    this.comboService.getNovedades().subscribe((data:any)=>{
      this.novedades = data;
    });
  }

  cargaEmpresas(){
    this.comboService.getEmpresas().subscribe((data:any)=>{
      this.empresas = data;
    });
  }

  sede(empresa:any){
    this.comboService.getSedes(empresa).subscribe((data:any)=>{
      this.sedes = data;
    });
  }

  cancelar() {
    this.form.reset();
  }

  validate(nameInput: string) {
    return this.mainService.validateInput(this.form, nameInput);
  }

  check(nameInput: string) {
    return this.mainService.checkInput(this.form, nameInput);
  }

  viewTestigos(id: any){
    if(id == true){
      this.hayTestigos = true;
    }else{
      this.form.controls['Preg_Quien'].setValue("");
      this.testigos = [];
      this.hayTestigos = false;
    }
  }
  viewDano(id: any){
    if(id == true){
      this.hayDanos = true;
    }else{
      this.hayDanos = false;
      this.form.controls['Preg_Dano_Generado'].setValue("");
      this.form.controls['Preg_Dano_Severidad'].setValue("");

    }
  }

  seleccionarImagen(event: any): void {
    this.imagen = event.target.files[0] ?? null;
    if(this.imagen.type.split("/")[0] == "image"){
      this.convertFile(event.target.files[0]).subscribe(base64 => {
        this.form.value.Imagen_Archivo = base64;
      });
    }else{
      this.imagen = null;
      alert("Por favor subir solo archivos: jpg, png, jpeg, svg")
    }
  }


  convertFile(file : File) : Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event!.target!.result!.toString()));
    return result;
  }

  goLogin(){
    window.open('http://localhost:4200/login');
  }
}


