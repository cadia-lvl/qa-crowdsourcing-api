import { UserInterface } from "../../../../../models";

export const prizeAvailable = (prizeId: string, user: UserInterface) => {
	switch (prizeId) {
		case "1":
			return true;
		case "2":
			return user.level >= 5;
		case "3":
			return user.level >= 10;
		case "4":
			return user.level >= 15;
		case "5":
			return user.level >= 20;
		default:
			return false;
	}
};
