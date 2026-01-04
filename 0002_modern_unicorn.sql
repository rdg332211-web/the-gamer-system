CREATE TABLE `customQuests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`category` enum('exercise','learning','health','productivity','custom') NOT NULL DEFAULT 'custom',
	`difficulty` enum('easy','medium','hard','extreme') NOT NULL DEFAULT 'medium',
	`baseXp` int NOT NULL DEFAULT 50,
	`targetProgress` int NOT NULL DEFAULT 1,
	`unit` varchar(50) NOT NULL DEFAULT '',
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customQuests_id` PRIMARY KEY(`id`)
);
