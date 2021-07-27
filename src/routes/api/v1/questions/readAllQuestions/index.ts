import { Request, Response } from "express";
import { Questions } from "../../../../../models";

/**
 * responds with QuestionsInterface[]
 *
 * @verb GET
 * @endpoint /api/v1/questions/
 * @version v1
 * @description the route will return all questions
 * @auth admin+
 * @example
 *     GET /api/v1/questions/ \
 *     --data { }
 */
export default async (req: Request, res: Response) => {
	try {
		const allowedQueryKeys = ["archived", "isImpossible", "isDisqualified"];
		const queryObject: { [key: string]: boolean } = {};
		for (const key in req.query) {
			if (!allowedQueryKeys.includes(key))
				throw new Error(`${key} is not a valid query key`);
			queryObject[key] = req.query[key] === "false" ? false : true;
		}
		const docs = await Questions.find(queryObject);
		res.send(docs);
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
};
