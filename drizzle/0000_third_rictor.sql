CREATE TABLE `parent_leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`parentName` varchar(120) NOT NULL,
	`phone` varchar(32) NOT NULL,
	`district` varchar(32) NOT NULL,
	`grade` varchar(8) NOT NULL,
	`track` varchar(64) NOT NULL,
	`score` int NOT NULL,
	`weaknessSummary` text NOT NULL,
	`consentAt` timestamp NOT NULL,
	`followUpStatus` enum('new','contacted','closed') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `parent_leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE INDEX `parent_leads_district_idx` ON `parent_leads` (`district`);--> statement-breakpoint
CREATE INDEX `parent_leads_status_created_idx` ON `parent_leads` (`followUpStatus`,`createdAt`);