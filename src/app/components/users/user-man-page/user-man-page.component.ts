import { Component, OnInit, OnDestroy } from '@angular/core';
import { IUser } from '../../../models/users/user';
import { UsersService } from '../../../services/users.service';
import { Router, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material';
import { AuthService } from '../../../services/auth.service';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { ConfirmDialogComponent } from '../../dialog-components/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from '../../dialog-components/alert-dialog/alert-dialog.component';
import { FirebaseRestService } from '../../../services/firebase-rest.service';
import { ICreateSession } from '../../../models/users/rest-firebase';
import { IAccountInfo } from '../../../models/users/rest-firebase';
import { Subscription } from 'rxjs';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

// import * as $ from 'jquery';
import { IProfile } from 'src/app/models/users/profile';
import { restoreBindingIndex } from '@angular/core/src/render3/instructions';
declare var $: any;

@Component({
  selector: 'app-user-man-page',
  templateUrl: './user-man-page.component.html',
  styleUrls: ['./user-man-page.component.css']
})

export class UserManPageComponent implements OnInit, OnDestroy {
  userList: IUser[];
  profileList: IProfile[];
  user: IUser = {
    cedula: '',
    nombre: '',
    genero: '',
    email: '',
    password: '',
    estado: '',
    perfil: []
  };
  editState: any = false;
  actionName: any = '';
  userSubscription: Subscription;
  profileSubscription: Subscription;
  constructor(public dialog: MatDialog,
    private us: UsersService,
    private router: Router,
    public authServ: AuthService,
    private rest: FirebaseRestService,
    private spinnerService: Ng4LoadingSpinnerService) {
   }

  ngOnInit() {
    this.spinnerService.show();
    this.userSubscription = this.us.getUsers().subscribe(users => {
      this.spinnerService.hide();
      this.userList = users;
    });
    this.profileSubscription = this.us.getProfiles().subscribe(profiles => {
      this.profileList = profiles;
    });
  }
  ngOnDestroy() {
    this.profileSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }
  nuevo() {
    $('#email').prop('readonly', false);
    $('#chk-adm').prop('checked', false);
    $('#chk-merc').prop('checked', false);
    $('#chk-clt').prop('checked', false);
    $('#rd-fem').prop('checked', false);
    $('#rd-masc').prop('checked', true);
    this.showEditView();
  }

  salir() {
    this.clearObject();
    this.closeEditView();
  }
  onSubmitRegisterAddUser(myForm: NgForm) {
    if (myForm.valid) {
      if (this.user.cedula.trim() === '') {
        this.openAlert('Scope Error', 'Campo Cédula no puede estar vacío');
        return;
      }
      if (this.user.nombre.trim() === '') {
        this.openAlert('Scope Error', 'Campo Nombre no puede estar vacío');
        return;
      }
      if (this.user.email.trim() === '') {
        this.openAlert('Scope Error', 'Campo Email no puede estar vacío');
        return;
      }
      if (this.user.password.trim() === '') {
        this.openAlert('Scope Error', 'Password no puede estar vacío');
        return;
      }

      if ($('#rd-masc').is(':checked')) {
        this.user.genero = 'Masculino';
      } else {
        this.user.genero = 'Femenino';
      }
      this.user.perfil = [];
      if ($('#chk-adm').is(':checked')) {
        this.user.perfil.push(
          this.profileList.find(e => e.nombre == 'Administrador')
        );
      }
      if ($('#chk-merc').is(':checked')) {
        this.user.perfil.push(
          this.profileList.find(e => e.nombre == 'Mercaderista')
        );
      }
      if ($('#chk-clt').is(':checked')) {
        this.user.perfil.push(
          this.profileList.find(e => e.nombre == 'Cliente')
        );
      }
      if (this.user.perfil.length === 0) {
        this.openAlert('Scope Error', 'Debe elegir por lo menos un perfil');
        return;
      }
      this.user.nombre = this.toTitleCase(this.user.nombre);
      this.user.email = this.user.email.toLowerCase();
      if (!this.editState) {
        this.user.estado = 'A';
        this.spinnerService.show();
        this.authServ.registerUser(this.user.email, this.user.password, this.user.nombre).then((res) => {
          this.spinnerService.hide();
          this.us.addUser(this.user);
          this.clearObject();
          this.salir();
        }).catch((err) => {
          this.openAlert('Sign Up Error!', err.message);
        });
      } else {
        let response: ICreateSession;
        this.spinnerService.show();
        this.rest.createSession(this.user.email, this.user.password).subscribe((data: {}) => {
          this.spinnerService.hide();
          response = data;
          if (response) {
            this.spinnerService.show();
            this.rest.updateProfile (response.idToken, this.user.nombre ).subscribe((res: {}) => {
              this.spinnerService.hide();
              if (res) {
                this.us.updUser(this.user);
                this.editState = false;
                this.clearObject();
                this.salir();
              }
            });
          }
        });
      }
    } else {
      this.openAlert('Scope Error', 'Algunos atributos no son válidos.');
    }
  }
  edit(user: IUser) {
    this.editState = true;
    $('#email').prop('readonly', true);
    if (user.genero == 'Masculino') {
      $('#rd-fem').prop('checked', false);
      $('#rd-masc').prop('checked', true);
    } else {
      $('#rd-masc').prop('checked', false);
      $('#rd-fem').prop('checked', true);
    }
    if ($('#chk-adm').is(':checked')) {
      $('#chk-adm').prop('checked', false);
    }
    if ($('#chk-merc').is(':checked')) {
      $('#chk-merc').prop('checked', false);
    }
    if ($('#chk-clt').is(':checked')) {
      $('#chk-clt').prop('checked', false);
    }
    $.each(user.perfil, function(e, d) {
      if (d.nombre == 'Administrador') {
        $('#chk-adm').prop('checked', true);
      }
      if (d.nombre == 'Mercaderista') {
        $('#chk-merc').prop('checked', true);
      }
      if (d.nombre == 'Cliente') {
        $('#chk-clt').prop('checked', true);
      }
    });
    this.showEditView();
    this.user = Object.assign({}, user);
  }
  delete(user: IUser) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { title: 'Confirmación', msg: 'Desea eliminar el usuario ' + user.nombre + '?' }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        user.estado = 'I';
        // this.us.delUser(user); // Cambia estado a I
        let response: ICreateSession;
        this.spinnerService.show();
        this.rest.createSession(user.email, user.password).subscribe((data: {}) => {
          this.spinnerService.hide();
          response = data;
          if (response) {
            this.spinnerService.show();
            this.rest.deleteAccount(response.idToken).subscribe((res: {}) => {
              this.spinnerService.hide();
              if (res) {
                this.us.delUser(user); // Elimina permanentemente de la base
              }
            });
          }
        });
      }
    });
  }
  showEditView() {
    if (!this.editState) {
      this.actionName = 'Nuevo';
      $('#colPwd').removeClass('d-none');
    } else {
      this.actionName = 'Editar';
      $('#colPwd').addClass('d-none');
    }

    $('#pnlEdit').removeClass('d-none');
    $('#pnlList').addClass('d-none');
  }
  closeEditView() {
    $('#pnlEdit').addClass('d-none');
    $('#pnlList').removeClass('d-none');
  }
  clearObject() {
    this.editState = false;
    this.user = {
      cedula: '',
      nombre: '',
      password: '',
      genero: '',
      email: '',
      estado: '',
      perfil: []
    };
  }
  openAlert(tit: string, msg: string): void {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '25%',
      data: { title: tit, msg: msg }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }
  onlyNumber(e) {
    if (e.which !== 8 && e.which !== 0 && (e.which < 48 || e.which > 57)) {
      return false;
    }
  }
  toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }
}
