export function createLifecoachController(coachs: any[], newCoachs: any) {
	const coachsIndex = coachs.findIndex((el) => el.id === newCoachs.id);
	if (coachsIndex === -1) {
		coachs.push(newCoachs);
	} else {
		coachs[coachsIndex] = { // when creat update it will tack some information from the last array 
			...coachs[coachsIndex],
			...newCoachs,
		};
	}
	return coachs;
}


