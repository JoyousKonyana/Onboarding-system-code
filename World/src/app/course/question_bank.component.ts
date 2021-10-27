import { Question } from './../_models/question';
import { QuizService } from './../_services/quiz.service';
import { CourseService } from './../_services/course.service';

import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AlertService } from '../_services';

@Component({ 
    templateUrl: 'question_bank.component.html',
    styleUrls: ['./ss_course.component.css'] 
})

export class Question_BankComponent implements OnInit {
  question: any[] = [];

  searchText = '';

  constructor(
      private quizService: QuizService,
      private alertService: AlertService,
  ) {
  }

  ngOnInit() {
      this.loadAll();
  }

  private loadAll() {
    this.quizService.getAllQuestion()
    .pipe(first())
    .subscribe(
      question => {
        this.question = question;
      },
      error => {
        this.alertService.error('Error, Data (Question) was unsuccesfully retrieved');
      } 
    );
  }

    newQuestionClicked = false;
    updateQuestionClicked = false;

  model: any = {};
  model2: any = {}; 

  model3:Question = {
      QuestionId: 0,
      QuizId: 1,
      QuestionCategoryId: 4,
      QuestionDescription: '',
      QuestionAnswer: '',
      QuestionMarkAllocation: 1
  };

  addQuestion() { 
    if(Object.keys(this.model).length < 4)
    {
      this.alertService.error("Error, you have an empty feild");
      this.newQuestionClicked = !this.newQuestionClicked;
      this.model = {};
    }
    else if((Object.keys(this.model).length==4))
    {
      this.model3.QuestionDescription = this.model.QuestionDescription;
      this.model3.QuestionAnswer = this.model.QuestionAnswer;
      this.model3.QuestionMarkAllocation = this.model.QuestionMarkAllocation;
      this.model3.QuizId = this.model.QuizId;
    
      this.quizService.createQuestion(this.model3)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Creation (Question) was successful', true);
                   this.loadAll();
                    this.newQuestionClicked = !this.newQuestionClicked;
                    this.model = {};
                },
                error => {
                    this.alertService.error('Error, Creation (Question) was unsuccesful');
                });
    }
  }
    
  
  deleteQuestion(i: number) {
    this.quizService.deleteQuestion(i)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Deletion (Question) was successful', true);
                    this.loadAll();
                },
                error => {
                    this.alertService.error('Error, Deletion (Question) was unsuccesful');
                });
  }

  myValue = 0;

  editQuestion(editQuestionInfo: number) {
    this.model2.QuestionDescription = this.question[editQuestionInfo].QuestionDescription;
    this.model2.QuestionAnswer = this.question[editQuestionInfo].QuestionAnswer;
    this.model2.QuestionMarkAllocation = this.question[editQuestionInfo].QuestionMarkAllocation;
    this.model2.QuestionMarkAllocation = this.question[editQuestionInfo].quizId
    this.myValue = editQuestionInfo;
  }

  updateQuestion() {
    let editQuestionInfo = this.myValue;

    this.model3.QuestionDescription = this.model2.QuestionDescription;
    this.model3.QuestionAnswer = this.model2.QuestionAnswer;
    this.model3.QuestionMarkAllocation = this.model2.QuestionMarkAllocation;
    this.model3.QuizId = this.model2.QuizId;

    for(let i = 0; i < this.question.length; i++) {
      if(i == editQuestionInfo) 
      {
        this.quizService.updateQuiz(this.question[editQuestionInfo].questionId, this.model3)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Update was successful', true);
                    this.loadAll();
                },
                error => {
                    this.alertService.error('Error, Update was unsuccesful');
                });
      }
    }
    
    }

    addNewQuestionBtn() {
        this.newQuestionClicked = !this.newQuestionClicked;
      }

      

}