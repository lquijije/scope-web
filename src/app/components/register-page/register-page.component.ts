import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { IUser } from '../../models/users/user';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';

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
  constructor(
    public authServ: AuthService,
    public router: Router,
    private us: UsersService,
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
            //console.log(this.user);
          });
        }
      }
    });
  }

  onSubmitRegisterAddUser() {
  }
}
