import { Component, OnInit } from '@angular/core';
import { IUser } from '../../../models/users/user';
import { UsersService } from '../../../services/users.service';
import { Router, NavigationEnd } from '@angular/router';

import * as $ from 'jquery';
declare var $: any;

@Component({
  selector: 'app-user-man-page',
  templateUrl: './user-man-page.component.html',
  styleUrls: ['./user-man-page.component.css']
})

export class UserManPageComponent implements OnInit {
  userList: any;
  constructor(private us: UsersService) {
   }

  ngOnInit() {
    console.log(this.us.getUsers());
    this.us.getUsers().subscribe(users => {
      console.log(users);
      this.userList = users;
    });
  }
  consultar() {
    /*   $('#table_users tbody tr').remove();
      var rows = '';
      this.userList.forEach( (d) => {
          rows += '<tr><td>' + d.nombre + '</td>' ;
          rows += '<td><i class="fa fa-edit"></i></td>' ;
          rows += '<td><i class="fa fa-trash"></i></td>' ;
          rows += '<td>' + d.email + '</td>' ;
          rows += '<td>' + d.cedula + '</td>' ;
          rows += '<td>' + d.estado + '</td></tr>' ;
      });
      $('#table_users tbody').append(rows); */
  }
  nuevo() {
    $('#pnlEdit').removeClass('d-none');
    $('#pnlList').addClass('d-none');
  }

  salir() {
    $('#pnlEdit').addClass('d-none');
    $('#pnlList').removeClass('d-none');
  }
  onSubmitRegisterAddUser() {

  }
}
