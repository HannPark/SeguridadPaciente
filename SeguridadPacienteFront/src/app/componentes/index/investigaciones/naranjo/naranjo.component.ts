import { Component, Inject, OnInit } from '@angular/core';
import {FormBuilder,FormControl,FormGroup,Validators} from '@angular/forms';
import { MainService } from 'src/app/servicios/main.service';
import { NaranjoService } from 'src/app/servicios/investigaciones/naranjo.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventoAdversoComponent } from '../evento-adverso/evento-adverso.component';

@Component({
  selector: 'app-naranjo',
  templateUrl: './naranjo.component.html',
  styleUrls: ['./naranjo.component.css']
})
export class NaranjoComponent implements OnInit {

  constructor(
    public mainService: MainService,
    public NaranjoService: NaranjoService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<NaranjoComponent>,
    @Inject(MAT_DIALOG_DATA) public guid: string,
  ) {
    this.form.controls['Id_Detalle'].setValue(this.guid);
  }

  form = new FormGroup({
    Id_Detalle: new FormControl(''),
    Naranjo_1: new FormControl(''),
    Naranjo_2: new FormControl(''),
    Naranjo_3: new FormControl(''),
    Naranjo_4: new FormControl(''),
    Naranjo_5: new FormControl(''),
    Naranjo_6: new FormControl(''),
    Naranjo_7: new FormControl(''),
    Naranjo_8: new FormControl(''),
    Naranjo_9: new FormControl(''),
    Naranjo_10: new FormControl(''),
    Naranjo_Observaciones: new FormControl(''),
  });

  ngOnInit(): void {
    console.log(this.guid)
  }

  submit() {
    console.log(this.form.value)
    if (this.form.valid) {
      this.NaranjoService.send(this.form.value).subscribe({
        next: (req:any) => {
          this.mainService.showToast('Guardado Correctamente');
        },
        error: (err: string) => {
          this.mainService.showToast(err, 'error');
        },
      });
    }
  }

  validate(nameInput: string) {
    return this.mainService.validateInput(this.form, nameInput);
  }

  check(nameInput: string) {
    return this.mainService.checkInput(this.form, nameInput);
  }

  cancelar(){
    this.dialogRef.close();
  }

  adverso(){
    const dialogRef = this.dialog.open(EventoAdversoComponent, {
      width: '100%',
      height: '100%',
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
    });
  }
}
