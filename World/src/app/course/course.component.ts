import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { Course } from '../_models';
import { CourseService, AlertService } from '../_services';

import { Router } from '@angular/router';

@Component({ 
    templateUrl: 'course.component.html',
    styleUrls: ['./ss_course.component.css'] 
})

export class CourseComponent implements OnInit {
  course: any[] = [];

  searchText = '';

  constructor(
      private courseService: CourseService,
      private alertService: AlertService,

      private router: Router
  ) {

  }

  ngOnInit() { 
      this.loadAll();
  }

  private loadAll() {
    this.courseService.getAllCourse()
    .pipe(first())
    .subscribe(
      course => {
        this.course = course;
      },
      error => {
        this.alertService.error('Error, Data was unsuccesfully retrieved');
      } 
    );
  }

    newCourseClicked = false;

  model: any = {};
  model2: any = {}; 

  model3:Course = {
    CourseId: 1,
    CourseDescription:'',
    CourseDueDate: '',
    CourseName: '',
  };

  //Remove this bad boy
  testData() {
    this.course.push(
      { courseId: 1, courseDescription: 'jfsd', courseDueDate: '213', courseName: '3212'},
      { courseId: 2, courseDescription: 'fklsdm', courseDueDate: '21', courseName: 'as'},
      { courseId: 3, courseDescription: 'cxzkl', courseDueDate: '21', courseName: ''},
      { courseId: 4, courseDescription: '321', courseDueDate: '', courseName: ''},
    );
  }

  addCourse() { 
    if(Object.keys(this.model).length < 3)
    {
      this.alertService.error("Error, you have an empty feild");
      this.newCourseClicked = !this.newCourseClicked;
      this.model = {};
    }
    else if((Object.keys(this.model).length== 3))
    {
      this.model3.CourseDescription = this.model.CourseDescription;
      this.model3.CourseDueDate = this.model.CourseDueDate;
      this.model3.CourseName = this.model.CourseName;
    
      this.courseService.create(this.model3)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Creation was successful', true);
                    this.loadAll();
                    this.newCourseClicked = !this.newCourseClicked;
                    this.model = {};
                },
                error => {
                    this.alertService.error('Error, Creation was unsuccesful');
                });
    }
  }
    
  
  deleteCourse(i: number) {
    this.courseService.delete(i+1)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Deletion was successful', true);
                    this.loadAll();
                },
                error => {
                    this.alertService.error('Error, Deletion was unsuccesful');
                });
  }

  myValue = 0;

  editCourse(editCourseInfo: number) {
    this.model2.CourseDescription = this.course[editCourseInfo].courseDescription;
    this.model2.CourseDueDate = this.course[editCourseInfo].courseDueDate;
    this.model2.CourseName = this.course[editCourseInfo].courseName;
    this.myValue = editCourseInfo;
  }

  updateCourse() {
    let editCourseInfo = this.myValue;

    for(let i = 0; i < this.course.length; i++) {

      if(i == editCourseInfo) 
      {
        this.model3.CourseDescription = this.model2.CourseDescription;
        this.model3.CourseDueDate = this.model2.CourseDueDate;
        this.model3.CourseName = this.model2.CourseName;

        this.courseService.update(this.course[editCourseInfo].courseId, this.model3)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Update was successful', true);
                    this.loadAll();
                    this.model2 = {};
                },
                error => {
                    this.alertService.error('Error, Update was unsuccesful');
                });
      }
    }
    }

    addNewCourseBtn() {
        this.newCourseClicked = !this.newCourseClicked;
      }

      

}