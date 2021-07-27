import { Response } from "express";
import { CurrentUserRequest } from "./interface";

/**
 * Route for getting score card of current user
 *
 * @verb GET
 * @endpoint api/v1/users/current/score_card
 * @version v1
 * @description the route returns the score card of current user
 * @auth user+
 * @example
 *     GET api/v1/users/current/score_card \
 *     --data { }
 */
export default async (req: CurrentUserRequest, res: Response) => {
	try {
		res.send(req.body.user.getPublic().scoreCard);
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
};
