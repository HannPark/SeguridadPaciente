import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {FormBuilder,FormControl,FormGroup,Validators} from '@angular/forms';
import { MainService } from 'src/app/servicios/main.service';
import { OpportunityService } from 'src/app/servicios/opportunity/opportunity.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import { MatPaginator } from '@angular/material/paginator';
import { UsersService } from 'src/app/servicios/usuarios/users.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-oportunidades-form',
  templateUrl: './oportunidades-form.component.html',
  styleUrls: ['./oportunidades-form.component.css']
})
export class OportunidadesFormComponent implements OnInit {
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource: any;
  private masterId : string;
  mejoras: any[] = [];
  responsables: any = [];

  displayedColumns = ['Codigo','Descripcion', 'Responsable'];

  constructor(
    public mainService: MainService,
    public OpportunityService: OpportunityService,
    public UsersService: UsersService,
    @Inject(MAT_DIALOG_DATA) public guid: string,
    public dialogRef: MatDialogRef<OportunidadesFormComponent>,)
  {
    console.log(guid);
    this.masterId = guid;
  }

  form = new FormGroup({
    Code: new FormControl(null, [Validators.required]),
    Cual: new FormControl(null, [Validators.required]),
    Responsables: new FormControl(null, [Validators.required]),
  });


  ngOnInit(): void {
    this.getResponsables();
  }


  getResponsables() {
    this.UsersService.get().subscribe({
      next: (req) => {
        console.log("data users", req)
        this.responsables = req;
      },
      error: (err: string) => {
        this.mainService.showToast(err, 'error');
      }
    });
  }

  submit() {
    if (this.mejoras.length > 0) {
      this.OpportunityService.create(this.mejoras).subscribe({
        next: (req:any) => {
          this.mainService.showToast('Guardado Correctamente', 'success');
        },
        error: (err: string) => {
          this.mainService.showToast(err, 'error');
        },
      });
    }
  }

  agregar() {
    if(this.form.valid){
      let object = {
        Id_Master: this.masterId,
        Codigo_Externo: this.form.value.Code,
        Descripcion: this.form.value.Cual,
        Responsable: this.form.value.Responsables
      }

      let antes = this.mejoras;
      antes.push(object);
      this.mejoras = [];
      this.mejoras = antes;
      this.table.renderRows();
      // this.mejoras.push(object);
      this.form.reset();
      console.log(this.mejoras)
    }
  }

  validate(nameInput: string) {
    return this.mainService.validateInput(this.form, nameInput);
  }

  check(nameInput: string) {
    return this.mainService.checkInput(this.form, nameInput);
  }
}
