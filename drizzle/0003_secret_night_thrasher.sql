CREATE TABLE `chatMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`role` varchar(20) NOT NULL,
	`content` text NOT NULL,
	`audioUrl` varchar(512),
	`transcription` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chatMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `extraMissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`trigger` varchar(100) NOT NULL,
	`xpReward` int NOT NULL,
	`completed` boolean NOT NULL DEFAULT false,
	`suggestedAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `extraMissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `penalties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` varchar(50) NOT NULL,
	`reason` varchar(255) NOT NULL,
	`xpLost` int NOT NULL DEFAULT 0,
	`attributeAffected` varchar(50),
	`attributeLost` int NOT NULL DEFAULT 0,
	`appliedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `penalties_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `xpDistribution` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`questId` int NOT NULL,
	`totalXp` int NOT NULL,
	`strengthXp` int NOT NULL DEFAULT 0,
	`vitalityXp` int NOT NULL DEFAULT 0,
	`agilityXp` int NOT NULL DEFAULT 0,
	`intelligenceXp` int NOT NULL DEFAULT 0,
	`wisdomXp` int NOT NULL DEFAULT 0,
	`luckXp` int NOT NULL DEFAULT 0,
	`questType` varchar(50) NOT NULL,
	`distributedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `xpDistribution_id` PRIMARY KEY(`id`)
);
