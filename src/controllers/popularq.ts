export function createQuestionController(questions: any[], newQuestions: any) {
	const questionIndex = questions.findIndex((el) => el.id === newQuestions.id);
	if (questionIndex === -1) {
		questions.push(newQuestions);
	} else {
		questions[questionIndex] = { // when creat update it will tack some information from the last array 
			...questions[questionIndex],
			...newQuestions,
		};
	}
	return questions;
}


