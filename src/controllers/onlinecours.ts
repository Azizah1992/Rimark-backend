export function createCourseController(courses: any[], newCourses: any) {
	const courseIndex = courses.findIndex((el) => el.id === newCourses.id);
	if (courseIndex === -1) {
		courses.push(newCourses);
	} else {
		courses[courseIndex] = { // when creat update it will tack some information from the last array 
			...courses[courseIndex],
			...newCourses,
		};
	}
	return courses;
}


