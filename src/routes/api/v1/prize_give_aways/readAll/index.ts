import { Request, Response } from "express";
import { ReadAllRequest } from "./interface";

export default async (req: ReadAllRequest, res: Response) => {
	const { user } = req.body;


    res.send([
        {
            time: new Date(1625072400000), // 17:00 june 30th,
            items: []
        },
        {
            time: new Date(1625677200000), // 17:00 july 7th,
            items: []
        }
    ]);
};