DROP TABLE IF EXISTS `children`;
CREATE TABLE `children`(
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `attendance`;
CREATE TABLE `attendance`(
  `id` int NOT NULL AUTO_INCREMENT,
  `childId` int NOT NULL,
  `checkInTimestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `checkOutTimestamp` datetime NULL,
PRIMARY KEY (`id`, `childId`, `timestamp`),
FOREIGN KEY (`childId`) REFERENCES `children` (`id`)
);

INSERT INTO `children` (`name`) VALUES
('Joseph'),
('Mary'),
('Katie'),
('Alexandra');