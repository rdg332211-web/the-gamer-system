CREATE TABLE `dailyQuestTemplates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`category` enum('exercise','learning','health','productivity','custom') NOT NULL,
	`baseXp` int NOT NULL DEFAULT 50,
	`difficulty` enum('easy','medium','hard','extreme') NOT NULL DEFAULT 'medium',
	`strengthBonus` int NOT NULL DEFAULT 0,
	`vitalityBonus` int NOT NULL DEFAULT 0,
	`agilityBonus` int NOT NULL DEFAULT 0,
	`intelligenceBonus` int NOT NULL DEFAULT 0,
	`wisdomBonus` int NOT NULL DEFAULT 0,
	`luckBonus` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `dailyQuestTemplates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('quest_available','quest_deadline','level_up','achievement_unlocked','motivational','penalty') NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`read` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`readAt` timestamp,
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `titles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`requiredLevel` int NOT NULL DEFAULT 1,
	`requiredXp` int NOT NULL DEFAULT 0,
	`requiredStreak` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `titles_id` PRIMARY KEY(`id`),
	CONSTRAINT `titles_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `userDailyQuests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`templateId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`category` enum('exercise','learning','health','productivity','custom') NOT NULL,
	`difficulty` enum('easy','medium','hard','extreme') NOT NULL,
	`currentProgress` int NOT NULL DEFAULT 0,
	`targetProgress` int NOT NULL,
	`unit` varchar(50) NOT NULL DEFAULT '',
	`xpReward` int NOT NULL,
	`completed` boolean NOT NULL DEFAULT false,
	`failed` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`dueAt` timestamp NOT NULL,
	`completedAt` timestamp,
	`failedAt` timestamp,
	CONSTRAINT `userDailyQuests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`questId` int NOT NULL,
	`xpGained` int NOT NULL,
	`levelUp` boolean NOT NULL DEFAULT false,
	`strengthGain` int NOT NULL DEFAULT 0,
	`vitalityGain` int NOT NULL DEFAULT 0,
	`agilityGain` int NOT NULL DEFAULT 0,
	`intelligenceGain` int NOT NULL DEFAULT 0,
	`wisdomGain` int NOT NULL DEFAULT 0,
	`luckGain` int NOT NULL DEFAULT 0,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userProgress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userTitles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`titleId` int NOT NULL,
	`unlockedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userTitles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `weeklyRewards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`week` int NOT NULL,
	`year` int NOT NULL,
	`questsCompleted` int NOT NULL DEFAULT 0,
	`totalXpEarned` int NOT NULL DEFAULT 0,
	`bonusXp` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `weeklyRewards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `level` int DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `xp` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `xpToNextLevel` int DEFAULT 100 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `hp` int DEFAULT 100 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `maxHp` int DEFAULT 100 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `mp` int DEFAULT 50 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `maxMp` int DEFAULT 50 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `strength` int DEFAULT 10 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `vitality` int DEFAULT 10 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `agility` int DEFAULT 10 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `intelligence` int DEFAULT 10 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `wisdom` int DEFAULT 10 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `luck` int DEFAULT 5 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `currentStreak` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `longestStreak` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `lastQuestCompletedAt` timestamp;