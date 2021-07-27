import { Response } from "express";
import { findByUserIdAndPopulateAnswers } from "../../../../../models/Questions/statics";
import { QuestionsRequest } from "./interface";

import { Questions } from "../../../../../models";

/**
 * responds with QuestionInterface
 *
 * @verb GET
 * @endpoint /api/v1/users/questions
 * @version v1
 * @description the route will populate all answered questions of current user with answer
 *     and return a QuestionInterface
 *
 * @auth user+
 * @example
 *     GET /api/v1/answers/507f191e810c19729de860ea \
 *     --data { }
 */
export default async (req: QuestionsRequest, res: Response) => {
	try {
		const { _id } = req.body.user;
		res.send(await Questions.findByUserIdAndPopulateAnswers(_id));
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
};
