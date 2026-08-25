CREATE TABLE `tutoring_centres` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`description` text NOT NULL,
	`whatsapp` varchar(32) NOT NULL,
	`website` varchar(320),
	`district` varchar(32) NOT NULL,
	`region` varchar(16) NOT NULL,
	`subjects` text NOT NULL,
	`supportedGrades` text NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`isFeatured` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tutoring_centres_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `tutoring_centres_featured_idx` ON `tutoring_centres` (`isFeatured`,`isActive`);--> statement-breakpoint
CREATE INDEX `tutoring_centres_district_idx` ON `tutoring_centres` (`district`);