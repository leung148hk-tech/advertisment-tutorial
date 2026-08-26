CREATE TABLE `referrals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`referenceCode` varchar(32) NOT NULL,
	`leadId` int NOT NULL,
	`centreId` int NOT NULL,
	`status` enum('draft','awaiting_parent_confirmation','parent_confirmed','shared_with_centre','enrolment_pending','enrolled','cancelled','expired') NOT NULL DEFAULT 'draft',
	`parentConfirmedAt` timestamp,
	`sharedWithCentreAt` timestamp,
	`enrolledAt` timestamp,
	`commissionStatus` enum('not_discussed','pending','confirmed','paid','waived') NOT NULL DEFAULT 'not_discussed',
	`commissionAmountCents` int,
	`commissionCurrency` varchar(3) NOT NULL DEFAULT 'HKD',
	`commissionPaidAt` timestamp,
	`commissionReference` varchar(120),
	`internalNote` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `referrals_id` PRIMARY KEY(`id`),
	CONSTRAINT `referrals_referenceCode_unique` UNIQUE(`referenceCode`)
);
--> statement-breakpoint
ALTER TABLE `tutoring_centres` ADD `address` varchar(320);--> statement-breakpoint
ALTER TABLE `tutoring_centres` ADD `isPubliclyListed` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `tutoring_centres` ADD `commissionArrangement` enum('pending','fixed','percentage','mixed') DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE `tutoring_centres` ADD `privatePartnerNote` text;--> statement-breakpoint
CREATE INDEX `referrals_lead_idx` ON `referrals` (`leadId`);--> statement-breakpoint
CREATE INDEX `referrals_centre_status_idx` ON `referrals` (`centreId`,`status`);--> statement-breakpoint
CREATE INDEX `referrals_commission_idx` ON `referrals` (`commissionStatus`,`createdAt`);