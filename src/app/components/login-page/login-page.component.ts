import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AlertDialogComponent } from '../dialog-components/alert-dialog/alert-dialog.component';

import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import * as $ from 'jquery';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    public router: Router
  ) { }

  username: string;
  password: string;

  ngOnInit() {
    $(function () {
      $('.toggle-password').click(function () {
        $(this).toggleClass('fa-eye-slash fa-eye');
        if ($('#lgPwd').attr('type') === 'password') {
          $('#lgPwd').attr('type', 'text');
        } else {
          $('#lgPwd').attr('type', 'password');
        }
      });
    });
  }

  login(): void {
    if (!this.username) {
      this.openAlert('Scope Alert!', 'Ingrese email');
      return;
    }
    if (!this.password) {
      this.openAlert('Scope Alert!', 'Password es requerido');
      return;
    }
    this.authService.loginUser(this.username, this.password)
    .then((res) => {
      this.router.navigate(['/']);
    }).catch((err) => {
      this.router.navigate(['/login']);
      this.openAlert('Authentication Error!', err.message );
      return;
    });
  }

  openAlert(tit: string, msg: string): void {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '250px',
      data: { title: tit , msg: msg }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }

}
