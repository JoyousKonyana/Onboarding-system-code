import { Quiz } from './../_models/quiz';
import { QuizService } from './../_services/quiz.service';
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
    templateUrl: 'set_quiz.component.html',
    styleUrls: ['./ss_course.component.css'] 
})

export class Set_QuizComponent implements OnInit {

    create: boolean = false;
    update: boolean = false;

    id: any;

    fileToUpload: File | null = null;

    quiz: any = {};

    constructor(
        private quizSerivce: QuizService,
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
        this.quizSerivce.getQuizByLessonOutcomeID(this.id)
        .pipe(first())
        .subscribe(
          quiz => {
            this.quiz = quiz;
          },
          error => {
            this.alertService.error('Error, Data was unsuccesfully retrieved');
          } 
        );

        if(this.quiz == null){
            this.create = true;
        }
        else{
            this.create = false;
        }
      }

    model: Quiz = {
      QuizId: 0,
      LessonOutcomeId: 0,
      QuizDescription: '',
      QuizMarkRequirement: '',
      QuizDueDate: '',
      QuizCompletionDate: '',
      NumberOfQuestions: 5
    }

    submit() {
        this.model.LessonOutcomeId = this.id;

        if(this.create = true){
            this.quizSerivce.createQuiz(this.model)
                .pipe(first())
                .subscribe(data => {
                    this.alertService.success('Successful Creation')
                    this.loadAll();
                }, error => {
                    this.alertService.success('Unsuccessful Creation')
            });
        }
        else{
            this.quizSerivce.updateQuiz(this.id, this.model)
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