export function createHomePageController(homepages: any[], newHomepages: any) {
	const homepageIndex = homepages.findIndex((el) => el.id === newHomepages.id);
	if (homepageIndex === -1) {
		homepages.push(newHomepages);
	} else {
		homepages[homepageIndex] = { // when creat update it will tack some information from the last array 
			...homepages[homepageIndex],
			...newHomepages,
		};
	}
	return homepages;
}