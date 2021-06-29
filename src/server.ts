import server from "./app";
import schedule from "node-schedule";
import * as Services from "./services";
import { UserInterface, Users } from "./models";
import axios from "axios";

/**
 * Start Express server.
 */
server.listen(server.get("port"), () => {
	console.log(
		"  App is running at http://localhost:%d in %s mode",
		server.get("port"),
		server.get("env")
	);
	console.log("  Press CTRL-C to stop\n");
});

/**
 * ==== CHRON TASKS =====
 * Chron tasks execute on a specific time interval,
 */

/**
 * UPDATING HIGHSCORES
 *
 * Schedules a chron task once per hour, at xx:41 to
 * update high score rankings
 */
schedule.scheduleJob("*/5 * * * *", async function () {
	const getUserContributionCount = (user: UserInterface) =>
		(user.questionCount ?? 0) +
		(user.verifyAnswerCount ?? 0) +
		(user.verifyQuestionCount ?? 0) +
		(user.articlesFoundCount ?? 0) +
		(user.answerCount ?? 0);

	try {
		console.log("UPDATING HIGHSCORE AT TIME: " + new Date().toISOString());
		const users = await Users.find();
		users.sort(
			(userA, userB) =>
				getUserContributionCount(userB) - getUserContributionCount(userA)
		);
		await Promise.all(
			users.map((user, i) => {
				user.hiscoreRank = i + 1;
				return user.save();
			})
		);
		console.log(
			`CRON SUCCES [${new Date().toISOString()}]: Updated ${
				users.length
			} users hiscore rankings`
		);
	} catch (e) {
		console.log(
			`CRON FAILURE [${new Date().toISOString()}]: Failed to update highscore rankings, ${
				e.message
			}`
		);
	}
});

/**
 * SENDING STREAKS NOTIFICATIONS
 * Schedules a chron task once per day, to users that have a streak of 2 or more,
 * to remind them to continue their streak.
 */
schedule.scheduleJob("00 20 * * *", async function () {
	// get the string representing yesterday as YYYY-MM-dd
	const yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	const lastDateActive = yesterday.toISOString().slice(0, 10);
	// minimum streak to remind users
	const MINIMUM_STREAK = 2;

	await Services.PushNotifications.send(
		"Streak reminder",
		{
			lastDateActive,
			dailyStreak: { $gt: MINIMUM_STREAK - 1 },
			"pushNotificationTokens.0": { $exists: true },
		},
		(user) => ({
			to: user.pushNotificationTokens,
			sound: "default",
			title: "Haltu áfram að standa þig vel!",
			body: `Þú hefur spilað ${user.dailyStreak} daga í röð, ekki láta syrpuna þína enda í dag.`,
		})
	);
});
