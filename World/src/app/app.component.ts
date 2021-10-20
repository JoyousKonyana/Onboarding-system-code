import { AuthenticationService } from './_services';
import { User, Role } from './_models';
import { ActivatedRoute, Router } from '@angular/router';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { User_Role } from './_models';
import { User_RoleService, EmployeeService, AlertService } from './_services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = 'bmw-onboarder-front';

  public sidebarShow: boolean = false;

  session = '2';

  user: any ;

  user_role: any = {};

  role: any = 'super user';

  model: any;
  model2: any;

    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthenticationService,

      private employeeService: EmployeeService,
      private user_roleService: User_RoleService
        ) {
        //this.authenticationService.user.subscribe(x => this.user = x);
    }
    
  ngOnInit() { 
    this.loadAll();
    this.findUserRole();
  }

 loadAll() {
    this.model = localStorage.getItem('user');

    this.authenticationService.getUserById(this.model)
      .pipe(first())
      .subscribe(user => {
        this.user = user;
        console.log(this.user);
        this.role = this.user.userRole.userRoleName;
        
        
      });

      this.model2 = this.user.userRoleId;

      // this.user_roleService.getUser_RoleById(1)
      //   .pipe(first())
      //   .subscribe(
      //     user_role => {
      //       this.user_role = user_role;
      //       console.log(this.user_role);
      //     }
      //   );

    this.findUserRole()
  }

  findUserRole() {
  
    this.role = this.user.userRole.userRoleName;
    alert(this.role);
    


    // JSON.parse(localStorage.getItem('token'));
  }

  //Block features according to user role
  get isAdmin() {
    return this.role == 'administrator' || this.role == 'SuperUser' ? true:false;
  }
  get isOnboarder() {
    return this.role == 'onboarder'? true:false;
  }
  get isReport() {
    return this.role == 'Manager' || this.role == 'Administrator' || this.role === 'SuperUser';
  }
  get isOfficeAdmin() {
    return this.role === 'office administrator' || this.role === 'administrator' || this.role === 'super user';
  }

  logout() {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/login';
    localStorage.removeItem('SeesionUser');
    localStorage.removeItem('user');
    this.router.navigateByUrl(returnUrl);
  }
}
