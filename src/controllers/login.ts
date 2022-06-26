// import login from "../routes/login";
// regester verefy token loging 
export function createLolginController(logs: any[], newLogin: any) {
	const loginIndex = logs.findIndex((el) => el.id === newLogin.id);
	if (loginIndex  === -1) {
		logs.push(newLogin);
	} else {
		logs[loginIndex] = { // when creat update it will tack some information from the last array 
			...logs[loginIndex],
			...newLogin,
		};
	}
	return logs;
}