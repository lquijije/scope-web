import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { AlertDialogComponent } from '../dialog-components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public isLogin: boolean;
  public userName: string;
  public userEmail: string;
  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    public router: Router
  ) { }

  ngOnInit() {
    this.authService.getAuth().subscribe((auth) => {
      if (auth) {
        this.isLogin = true;
        this.userName = auth.displayName;
        this.userEmail = auth.email;
      } else {
        this.isLogin = false;
        this.userName = '';
        this.userEmail = '';
      }
    });
  }

  logout(): void {
    this.authService.logout().then((res) => {
      this.router.navigate(['/login']);
    }).catch((err) => {
      this.openDialog('Error de Logout', err.message);
    });
  }

  openDialog(tit: string, msg: string): void {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '250px',
      data: { title: tit, msg: msg }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log(result);
    });
  }
}
