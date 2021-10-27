import { QuizService } from './../_services/quiz.service';


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { AlertService } from '../_services';
import { ModalService } from '../_modal';

@Component({
  templateUrl: './take_quiz.component.html',
  styleUrls: [ './ss_onboarder.component.css' ]
})
export class Take_QuizComponent implements OnInit {
  //Store from Database
  quiz: any;
  question: any;

  //Stores users answer and later compares
  model!: string;

  //Keep track of user scores
  score!: number;

  //We store the mark Requirement to pass Quiz here
  myValue = 0;

  id:any;

constructor(
  private alertService: AlertService,
  private quizService: QuizService,

  private modalService: ModalService,

  private _Activatedroute:ActivatedRoute,
  private router: Router,
) {
}

 ngOnInit() { 
  this._Activatedroute.paramMap.subscribe(params => { 
    this.id = params.get('id'); 
  });

  this.loadAll();
 }

  loadAll() {
    //Lets Get All The Quiz under this LessonOutcome
    this.quizService.getQuizByLessonOutcomeID(this.id)
    .pipe(first())
    .subscribe(
      quiz => {
        this.quiz = quiz;
        console.log(this.quiz);
      },
      error => {
        this.alertService.error('Error, Data (Quiz) was unsuccesfully retrieved');
      } 
    );
  }

  openModal(id: string, quizId: number, index: number) {
    this.modalService.open(id);

    this.myValue = this.question[index].quizMarkRequirement;

    this.quizService.getQuestionByQuizID(quizId)
      .pipe(first())
      .subscribe(
        question => {
          this.question = question;
          console.log(this.question)
        },
        error => {
          this.alertService.error('Error, Data (Question) was unsuccesfully retrieved');
        } 
      );
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

  saveAnswer(index: number){
    if(this.model = this.question[index].questionAnswer)
    {
      this.score += Number(this.question[index].questionMarkAllocation);

      //Empty model
      this.model = ''

      //Remove the Question
      this.question[index].splice(index, 1)
      alert('Answer Saved');
    }
    else{
      //Empty Model
      this.model = ''

      //Remove the Question
      this.question[index].splice(index, 1)
      alert('Answer Saved');
    }
  }

  submitQuiz(){
    if(this.question.length == 0){
      if(this.score >= this.myValue){
        alert("Congratulation, you met the minimum requirement of " + this.myValue + ", You have passed.");
        this.score = 0;
      }
    }
  }

}
