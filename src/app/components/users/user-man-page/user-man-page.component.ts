import { Component, OnInit } from '@angular/core';
import { IUser } from '../../../models/users/user';
import { UsersService } from '../../../services/users.service';

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
    this.us.getUsers().subscribe(users => {
      console.log(users);
      this.userList = users;
    });
  }

}
