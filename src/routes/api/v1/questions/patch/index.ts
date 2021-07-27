import _ from "lodash";
import { Request, Response } from "express";
import { Questions } from "../../../../../models";

/**
 * responds with QuestionsInterface
 *
 * @verb PATCH
 * @endpoint /api/v1/questions/:id
 * @version v1
 * @description provided a valid id the route will update and return the question
 * @auth admin+
 * @example
 *     PATCH /api/v1/questions/:id \
 *     --data { }
 */
export default async (req: Request, res: Response) => {
	try {
		const body = _.pick(req.body, [
			"archived",
			"isImpossible",
			"isDisqualified",
			"text",
		]);

		const doc = await Questions.findByIdAndUpdate(
			req.params.id,
			{
				$set: body,
			},
			{
				new: true,
			}
		);

		res.send(doc);
	} catch (error) {
		console.log(error);
		res.status(400).send("Error! Question patch unsuccessful");
	}
};
