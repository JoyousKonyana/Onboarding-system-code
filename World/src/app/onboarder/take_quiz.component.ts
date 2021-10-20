import { QuizService } from './../_services/quiz.service';


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { AlertService } from '../_services';

@Component({
  templateUrl: './take_quiz.component.html',
  styleUrls: [ './ss_onboarder.component.css' ]
})
export class Take_QuizComponent implements OnInit {
  //Store from Database
  quiz: any = {};
  question: any[] = [];
  option: any [] = [];
  dataHolder: any [] = [];

  id:any;
  
 questions:any;
 currentIndex:any; //number
 notAttempted:any;
 correct:any;
 currentQuestionSet:any;
 start=false;
 gameover=false;
 buttonname="Start Quiz";

constructor(
  private alertService: AlertService,
  private quizService: QuizService,

  private _Activatedroute:ActivatedRoute,
  private router: Router,
) {
      this.currentIndex=0;
      //this.currentQuestionSet= this.questions[this.currentIndex];
}

 ngOnInit() { 
  this._Activatedroute.paramMap.subscribe(params => { 
    this.id = params.get('id'); 
  });

  this.loadAll();

  this.currentIndex=0;
  this.currentQuestionSet= this.questions[this.currentIndex];
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

    if(this.quiz == null)
    {
      this.alertService.error('Quiz is currently Empty. Please wait for Administrator to make Quiz Available');
    }
    else{
      //Lets Get All The Question For This Quiz
      this.quizService.getQuestionByQuizID(9)
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

      if(this.question == null){
      }
      else{
        //Lets Get All The Option For This Quiz
            //First We Need too Loop since we are getting by Question ID
        for(let i = 0; i < this.question.length; i++) {
      this.quizService.getOptionById(this.question[i].questionId)
        .pipe(first())
        .subscribe(
          dataHolder => {
            this.dataHolder = dataHolder;
            this.option.push(this.dataHolder)
            console.log(this.dataHolder)
          },
          error => {
            this.alertService.error('Error, Data (Option) was unsuccesfully retrieved');
          } 
        );

        //We Need to also Loop all the Options in this Question and push to final array
        for(let i = 0; i < this.question.length; i++) {
          this.option.push(this.dataHolder[i]);
        }
        }
      }
    }
      this.loadToDisplayArray();
    }

 loadToDisplayArray(){
  for(let i = 0; i < this.question.length; i++) {
    this.questions[i].id = this.question[i].questionId;
    this.questions[i].question = this.question[i].questionDescription;
    this.questions[i].answer = this.question[i].questionAnswer;

    for(let x = 0; x < this.option.length; x++) {
      if(this.option[x].questionId == this.question[i].questionId){
        this.questions[i].option[x].ids = this.option[x].optionId;
        this.questions[i].option[x].optionId = this.option[x].optionNo;
        this.questions[i].option[x].name = this.option[x].optionDescription;
      }
    }
  }
 }
  
     next(){
    this.currentIndex = this.currentIndex + 1;
    this.currentQuestionSet= this.questions[this.currentIndex];
    //this.currentQuestionSet1= this.question[this.currentIndex];
   }

   submit(){
    this.buttonname="Retry";
    if(this.currentIndex+1==this.questions.length){
       this.gameover=true;
       this.start=false;
         this.correct=0;
    this.notAttempted=0;
    this.questions.map((x: { selected: number; answer: any; })=>{
        if(x.selected!=0){
          if(x.selected == x.answer)
            this.correct=this.correct + 1;
        }
        else{
          this.notAttempted=this.notAttempted + 1;
        }
        x.selected=0;
    });
  }
  
   }
   startQuiz(){
    this.gameover=false;
    this.currentIndex=0;
   this.currentQuestionSet= this.questions[this.currentIndex];
      this.start=true;
   }
}
