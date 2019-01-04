import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import * as $ from 'jquery';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  public isLogin: boolean;
  public user: string;
  constructor(
    public authService: AuthService
  ) {
    // this.user = this.authService.getUser().displayName;
  }

  ngOnInit() {
    this.authService.getAuth().subscribe((auth) => {
      if (auth) {
        this.user = auth.displayName;
        this.isLogin = true;
      } else {
        this.isLogin = false;
      }
    });
  }

}
