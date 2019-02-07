import { Component, OnInit } from '@angular/core';
import { IUser } from '../../../models/users/user';
import { UsersService } from '../../../services/users.service';
import { Router, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { ConfirmDialogComponent } from '../../dialog-components/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from '../../dialog-components/alert-dialog/alert-dialog.component';

import * as $ from 'jquery';
declare var $: any;

@Component({
  selector: 'app-user-man-page',
  templateUrl: './user-man-page.component.html',
  styleUrls: ['./user-man-page.component.css']
})

export class UserManPageComponent implements OnInit {
  userList: any;
  user: IUser = {
    cedula: '',
    nombre: '',
    genero: '',
    email: '',
    estado: '',
    perfil: ''
  };
  editState: any = false;
  actionName: string ='';
  constructor(public dialog: MatDialog,
    private us: UsersService) {
   }

  ngOnInit() {
    this.us.getUsers().subscribe(users => {
      console.log(users);
      this.userList = users;
    });
  }
  nuevo() {
    this.showEditView();
  }

  salir() {
    this.clearObject();
    this.closeEditView();
  }
  onSubmitRegisterAddUser() {
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
      perfil: ''
    };
  }
}
