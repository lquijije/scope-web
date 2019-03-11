import { Component, OnInit } from '@angular/core';
import { IUser } from '../../../models/users/user';
import { UsersService } from '../../../services/users.service';
import { Router, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { ConfirmDialogComponent } from '../../dialog-components/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from '../../dialog-components/alert-dialog/alert-dialog.component';

import * as $ from 'jquery';
import { IProfile } from 'src/app/models/users/profile';
declare var $: any;

@Component({
  selector: 'app-user-man-page',
  templateUrl: './user-man-page.component.html',
  styleUrls: ['./user-man-page.component.css']
})

export class UserManPageComponent implements OnInit {
  userList: IUser[];
  profileList: IProfile[];
  user: IUser = {
    cedula: '',
    nombre: '',
    genero: '',
    email: '',
    estado: '',
    perfil: []
  };
  editState: any = false;
  actionName: string ='';
  constructor(public dialog: MatDialog,
    private us: UsersService,
    private router: Router) {
   }

  ngOnInit() {
    this.us.getUsers().subscribe(users => {
      this.userList = users;
    });
    this.us.getProfiles().subscribe(profiles => {
      this.profileList = profiles;
    });
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
  onSubmitRegisterAddUser() {
    if($('#rd-masc').is(':checked')){
      this.user.genero = 'Masculino';
    }else{
      this.user.genero = 'Femenino';
    }
    this.user.perfil = [];
    if($('#chk-adm').is(':checked')){
      this.user.perfil.push(
        this.profileList.find(e => e.nombre == 'Administrador')
      );
    }
    if($('#chk-merc').is(':checked')){
      this.user.perfil.push(
        this.profileList.find(e => e.nombre == 'Mercaderista')
      );
    }
    if($('#chk-clt').is(':checked')){
      this.user.perfil.push(
        this.profileList.find(e => e.nombre == 'Cliente')
      );
    }
    if (!this.editState) {
      this.user.estado = 'A';
      this.us.addUser(this.user);
    } else {
      this.us.updUser(this.user);
      this.editState = false;
    }
    this.clearObject();
    this.salir();
    
  }
  edit(user: IUser) {
    this.editState = true;
    $('#email').prop('readonly', true);
    if(user.genero == 'Masculino'){
      $('#rd-fem').prop('checked', false);
      $('#rd-masc').prop('checked', true);
    }else{
      $('#rd-masc').prop('checked', false);
      $('#rd-fem').prop('checked', true);
    }
    
    if($('#chk-adm').is(':checked')){
      $('#chk-adm').prop('checked', false);
    }
    if($('#chk-merc').is(':checked')){
      $('#chk-merc').prop('checked', false);
    }
    if($('#chk-clt').is(':checked')){
      $('#chk-clt').prop('checked', false);
    }
    $.each(user.perfil,function(e,d){
      if(d.nombre == 'Administrador'){
        $('#chk-adm').prop('checked', true);
      }
      if(d.nombre == 'Mercaderista'){
        $('#chk-merc').prop('checked', true);
      }
      if(d.nombre == 'Cliente'){
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
        this.us.delUser(user); // Elimina permanentemente de la base
      }
    });
  }
  showEditView() {
    if(!this.editState){
      this.actionName = 'Nuevo';
      $('#colPwd').removeClass('d-none');
    }else{
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
      genero: '',
      email: '',
      estado: '',
      perfil: []
    };
  }
}
