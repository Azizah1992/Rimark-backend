export function createComplementController(complements: any[], newComplements: any) {
	const complementsIndex = complements.findIndex((el) => el.id === newComplements.id);
	if (complementsIndex === -1) {
		complements.push(newComplements);
	} else {
		complements[complementsIndex] = { // when creat update it will tack some information from the last array 
			...complements[complementsIndex],
			...newComplements,
		};
	}
	return complements;
}