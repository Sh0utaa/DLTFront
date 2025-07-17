export interface Answer {
  id: number;
  text: string;
}

export interface Question {
  id: number;
  image: string | null;
  questionContent: string;
  answers: Answer[];
}

export interface UserAnswer {
  questionId: number;
  answerId: number;
}
