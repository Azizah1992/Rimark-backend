

export function createUserController(users: any[], newUser: any) {
	const usertIndex = users.findIndex((el) => el.id === newUser.id);
	if (usertIndex === -1) {
		users.push(newUser);
	} else {
		users[usertIndex] = {
			...users[usertIndex],
			...newUser,
		};
	}
	return users;
}


