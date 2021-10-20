import { Lesson_ContentService } from './../_services/lesson_conent.service';
import { Lesson_Content } from './../_models/lesson_content';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { User } from '../_models';
import { UserService, AuthenticationService, AlertService } from '../_services';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({ 
    templateUrl: 'learning_content.component.html',
    styleUrls: ['./ss_course.component.css'] 
})

export class Learning_ContentComponent implements OnInit {

    create: boolean = false;
    update: boolean = false;

    id: any;

    fileToUpload: File | null = null;

    lesson_content: any = {};

    constructor(
        private lessoncontentService: Lesson_ContentService,
        private alertService: AlertService,

      private _Activatedroute:ActivatedRoute,
      private router: Router,
      private form: FormBuilder,
  ) {
  }

  dropDown = this.form.group({
    ArchiveStatusId: new FormControl('', Validators.required),
    LessonContenetTypeId: new FormControl ('',Validators.required),
  })

    ngOnInit() {
    this._Activatedroute.paramMap.subscribe(params => { 
        this.id = params.get('id'); 
      });
    }

    loadAll() {
        this.lessoncontentService.getLesson_ContentByLessonoutcomeId(this.id)
        .pipe(first())
        .subscribe(
          lesson_content => {
            this.lesson_content = lesson_content;
          },
          error => {
            this.alertService.error('Error, Data was unsuccesfully retrieved');
          } 
        );

        if(this.lesson_content == null){
            this.create = true;
        }
        else{
            this.create = false;
        }
      }

    model: Lesson_Content = {
        LessonConentId: 0,
        LessonContenetTypeId: 0,
        LessonOutcomeId: 0,
        ArchiveStatusId: 0,
        LessonContentDescription: '',
        LessonContent1: ''
    }

    updateItem(e: any) {
        if(e.target.checked){
            this.model.ArchiveStatusId  = 1
        }
        else{
            this.model.ArchiveStatusId  = 2
        }
    }

    handleFileInput(files: any) {
        this.fileToUpload = files.item(0);
    }

    submit() {
        this.model.LessonOutcomeId = this.id;

        if(this.create = true){
            this.lessoncontentService.create(this.model)
                .pipe(first())
                .subscribe(data => {
                    this.alertService.success('Successful Creation')
                }, error => {
                    this.alertService.success('Unsuccessful Creation')
            });
        }
        else{
            this.lessoncontentService.update(this.id, this.model)
                .pipe(first())
                .subscribe(data => {
                    this.alertService.success('Successful Update')
                }, error => {
                    this.alertService.success('Unsuccessful Update')
            });
        }

        
      }

  setContent(){
    
  }

 }