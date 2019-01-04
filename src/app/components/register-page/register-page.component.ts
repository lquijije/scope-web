import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {
  public cedula: string;
  public nombres: string;
  public email: string;
  public password: string;

  constructor(
    public authServ: AuthService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  onSubmitRegisterAddUser() {
    this.authServ.registerUser(this.email, this.password).then( (res) => {
      console.log(res);
        const user = this.authServ.afAuth.auth.currentUser;
        user.updateProfile({
          displayName: this.nombres,
          photoURL: ''
        }).then(function () {
          console.log(user);
        }, function (error) {
          // An error happened.
        });
        // console.log(res);
        this.router.navigate(['/']);
      }).catch( (err) => {
        console.log(err);
      });
  }
}
