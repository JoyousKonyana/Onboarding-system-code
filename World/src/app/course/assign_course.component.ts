
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { Onboarder, Course, Onboarder_Course_Enrollment } from '../_models';
import { OnboarderService, CourseService, Onboarder_Course_EnrollmentService, AuthenticationService, AlertService } from '../_services';

import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({ 
    templateUrl: 'assign_course.component.html',
    styleUrls: ['./ss_course.component.css'] 
})

export class Assign_CourseComponent implements OnInit {
  onboarder: any[] = [];
  course: any[] = [];
  
  date!: string;

  constructor(
      private onboarderService: OnboarderService,
      private courseService: CourseService,
      private onboarder_course_enrollmentService: Onboarder_Course_EnrollmentService,

      private alertService: AlertService,
      private form: FormBuilder,
  ) {
  }

  enrollmentForm = this.form.group({
    course: new FormControl('', Validators.required),
    onboarder: new FormControl ('',Validators.required),
    OnboarderEnrollmentDate: new FormControl('',Validators.required),
  })

  ngOnInit() { 
      this.loadAll();

      this.date = new Date().toISOString().slice(0, 10);
  }

private loadAll() {
  this.courseService.getAllCourse()
    .pipe(first())
    .subscribe(
      course => {
        this.course = course;
      },
      error => {
        this.alertService.error('Error, Data (Course) was unsuccesfully retrieved');
      } 
    );

    this.onboarderService.getAllOnboarder()
    .pipe(first())
    .subscribe(
      onboarder => {
        this.onboarder = onboarder;
      },
      error => {
        this.alertService.error('Error, Data (Onboarder) was unsuccesfully retrieved');
      } 
    );
  }

  model2: Onboarder_Course_Enrollment = {
      OnboarderId: 0,
      CourseId: 0,
      OnboarderEnrollmentDate: '',
  };

  addCourse_Onboarder_Enrollment() { 
    this.model2.CourseId = this.enrollmentForm.get('course')?.value;
    this.model2.OnboarderId = this.enrollmentForm.get('onboarder')?.value;
    this.model2.OnboarderEnrollmentDate = this.enrollmentForm.get('OnboarderEnrollmentDate')?.value;

    this.courseService.assigne(this.model2)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Course has been successfully Assigned', true);
                },
                error => {
                    this.alertService.error('Error, Assign was unsuccesful');
                });
  }

}