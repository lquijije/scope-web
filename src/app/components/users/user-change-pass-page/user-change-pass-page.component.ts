import { Component, OnInit } from '@angular/core';
import { IUser } from '../../../models/users/user';
import { AuthService } from '../../../services/auth.service';
import { MatDialog } from '@angular/material';
import { AlertDialogComponent } from '../../dialog-components/alert-dialog/alert-dialog.component';
import { UsersService } from '../../../services/users.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';

// import * as $ from 'jquery';
declare var $: any;
@Component({
  selector: 'app-user-change-pass-page',
  templateUrl: './user-change-pass-page.component.html',
  styleUrls: ['./user-change-pass-page.component.css']
})
export class UserChangePassPageComponent implements OnInit {
  userList: IUser[];
  user: IUser = {
    cedula: '',
    nombre: '',
    genero: '',
    email: '',
    password: '',
    estado: '',
    perfil: []
  };
  curpass: any;
  newpas1: any;
  newpas2: any;
  constructor(
    public dialog: MatDialog,
    private us: UsersService,
    public authServ: AuthService,
    public router: Router
  ) { }

  ngOnInit() {
    this.authServ.getAuth().subscribe((data: {}) => {
      if (data) {
        const currentUser = this.authServ.getCurrentUser();
        if (currentUser) {
          this.user.nombre = currentUser.displayName;
          this.user.email = currentUser.email;
          if (this.user.email !== '') {
            this.us.getUserByEmail(this.user.email).subscribe(users => {
              this.userList = users;
              this.user = this.userList[0];
            });
          }
        }
      }
    });
    $('.toggle-password0').click(function () {
      $(this).toggleClass('fa-eye-slash fa-eye');
      if ($('#password').attr('type') === 'password') {
        $('#password').attr('type', 'text');
      } else {
        $('#password').attr('type', 'password');
      }
    });
    $('.toggle-password1').click(function () {
      $(this).toggleClass('fa-eye-slash fa-eye');
      if ($('#newpass1').attr('type') === 'password') {
        $('#newpass1').attr('type', 'text');
      } else {
        $('#newpass1').attr('type', 'password');
      }
    });
    $('.toggle-password2').click(function () {
      $(this).toggleClass('fa-eye-slash fa-eye');
      if ($('#newpass2').attr('type') === 'password') {
        $('#newpass2').attr('type', 'text');
      } else {
        $('#newpass2').attr('type', 'password');
      }
    });
  }

  onSubmit() {
    if (!this.curpass) {
      this.openAlert('Warning', 'Clave actual no puede estar vacío');
      return false;
    }
    if (!this.newpas1) {
      this.openAlert('Warning', 'Nueva Clave no puede estar vacío');
      return false;
    }
    if (!this.newpas1) {
      this.openAlert('Warning', 'Debe confirmar password');
      return false;
    }
    if (this.newpas1 !== this.newpas2) {
      this.openAlert('Warning', 'La nueva clave no coincide con la confirmación');
      return false;
    }

    const credentials = firebase.auth.EmailAuthProvider.credential(
      this.user.email, this.curpass);

    this.authServ.getAuth().subscribe((data: {}) => {
      this.authServ.getCurrentUser().reauthenticateWithCredential(credentials).then(
        success => {
            this.authServ.getCurrentUser().updatePassword(this.newpas1).then((res) => {
              this.user.password = this.newpas1;
              this.us.updUser(this.user).then(() => {})
              .catch((err) => {
                this.openAlert('Error', err.message);
              });
              this.logout();
            }).catch((err) => {
              this.openAlert('Error', err.message);
            });
        }).catch((err) => {
          this.openAlert('Error', err.message);
          }
        );
    });
  }
  openAlert(tit: string, msg: string): void {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '25%',
      data: { title: tit, msg: msg }
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }
  logout(): void {
    this.authServ.logout().then((res) => {
      this.router.navigate(['/login']);
    }).catch((err) => {
      this.openAlert('Error de Logout', err.message);
    });
  }
}
