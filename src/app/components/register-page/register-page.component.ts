import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { IUser } from '../../models/users/user';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { MatDialog } from '@angular/material';
import { AlertDialogComponent } from '../dialog-components/alert-dialog/alert-dialog.component';
import { ICreateSession } from '../../models/users/rest-firebase';
import { FirebaseRestService } from '../../services/firebase-rest.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {
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
  constructor(public dialog: MatDialog,
    public authServ: AuthService,
    public router: Router,
    private us: UsersService,
    private rest: FirebaseRestService
  ) { }

  ngOnInit() {
    this.authServ.getAuth().subscribe((data: {}) => {
      if (data) {
        const currentUser = this.authServ.getCurrentUser();
        this.user.nombre = currentUser.displayName;
        this.user.email = currentUser.email;
        if (this.user.email !== '') {
          this.us.getUserByEmail(this.user.email).subscribe(users => {
            this.userList = users;
            this.user = this.userList[0];
          });
        }
      }
    });
  }

  onSubmit() {
    if (this.user.nombre === '') {
      this.openAlert('Warning', 'Campo nombre no puede estar vacío');
      return false;
    }
    if (this.user.email === '') {
      this.openAlert('Warning', 'Campo email no puede estar vacío');
      return false;
    }
    if (this.user.cedula === '') {
      this.openAlert('Warning', 'Campo cedula/ruc no puede estar vacío');
      return false;
    }
    // Opción 1 hacer el update con Api Rest de Google.
    // let response: ICreateSession;
    // this.rest.createSession(this.user.email, this.user.password).subscribe((data: {}) => {
    //   response = data;
    //   if (response) {
    //     this.rest.updateProfile(response.idToken, this.user.nombre).subscribe((res: {}) => {
    //       if (res) {
    //         this.us.updUser(this.user);
    //       }
    //     });
    //   }
    // });
    // Opción 2 hacer el update con Angular Fire auth
    this.authServ.getCurrentUser().updateProfile({
      displayName: this.user.nombre,
      photoURL: ''
    }).then((res) => {
        this.us.updUser(this.user).then(() => {
          }
        ).catch( (err) => {
          this.openAlert('Error', err.message);
        });
        this.openAlert('Success', 'Perfil Actualizado exitosamente');
        // TODO: refresh page
      }
    ).catch((err) => {
      this.openAlert('Error', err.message);
    });
  }
  openAlert(tit: string, msg: string): void {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '250px',
      data: { title: tit, msg: msg }
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }
}
