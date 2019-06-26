import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { MenuService } from '../../services/menu.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { AlertDialogComponent } from '../dialog-components/alert-dialog/alert-dialog.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public isLogin: boolean;
  public userName: string;
  public userEmail: string;
  public user: any;
  public menu: any = [];
  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    public us: UsersService,
    public router: Router,
    public ms: MenuService,
    private spinnerService: Ng4LoadingSpinnerService
  ) { }

  ngOnInit() {
    this.authService.getAuth().subscribe((auth) => {

      if (auth) {
        
        this.isLogin = true;
        this.userName = auth.displayName;
        this.userEmail = auth.email;
        
        this.us.getUserByEmail(this.userEmail).subscribe( usr => {
          if (usr) {
            console.log(usr);
            this.user = usr[0];
            if (this.user.perfil) {
              const perfil = this.user.perfil.filter( e => {
                return e.id === 'TACSbISZsdMQKsHRGiKc' || e.id === 'l4ICDa0d6ZbY325Z3RSY';
              });
              if (perfil.length === 0) {
                this.openDialog('Scope Authorization', 'No está autorizado para usar esta aplicación');
                this.logout();
              } else {
                this.menu = [];
                perfil.forEach(e => {
                  this.ms.getMenuByProfile(e).subscribe(mnu => {
                    this.menu = this.menu.concat(mnu).sort((a, b) => {
                      return ((parseInt(a.order, 10) > parseInt(b.order, 10)) ? 1 : -1);
                    });
                  });
                });
              }
            }
          }
        });
      } else {
        this.isLogin = false;
        this.userName = '';
        this.userEmail = '';
      }
    });
  }

  logout(): void {
    this.spinnerService.show();
    this.authService.logout().then((res) => {
      this.spinnerService.hide();
      this.router.navigate(['/login']);
    }).catch((err) => {
      this.spinnerService.hide();
      this.openDialog('Scope Authorization', err.message);
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
  evaluate(sub: any) {
    if (sub.name == 'Salir') {
      this.logout();
      window.location.reload();
    }
  }
}
