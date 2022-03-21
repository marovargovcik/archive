DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`(
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `conversation`;
CREATE TABLE `conversation`(
  `id` int NOT NULL,
  `userId` int NOT NULL,
PRIMARY KEY (`id`, `userId`),
FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
);

DROP TABLE IF EXISTS `message`;
CREATE TABLE `message`(
  `id` int NOT NULL,
  `userId` int NOT NULL,
  `conversationId` int NOT NULL,
  `txt` text NOT NULL, -- The message contents
PRIMARY KEY (`id`),
FOREIGN KEY (`userId`) REFERENCES `user` (`id`),
FOREIGN KEY (`conversationId`) REFERENCES `conversation` (`id`)
);



-- Populate with data.
INSERT INTO `user` (`id`, `name`) VALUES
('1', 'Bret'),
('2', 'John'),
('3', 'Maline'),
('4', 'Blake'),
('5', 'Emilie'),
('6', 'Alex'),
('7', 'Zuz');

INSERT INTO `conversation` (`id`, `userId`) VALUES
('1', '1'),
('1', '3'),
('2', '2'),
('2', '3'),
('3', '1'),
('3', '4'),
('3', '6'),
('3', '7'),
('4', '4'),
('4', '5'),
('5', '2'),
('5', '7'),
('6', '3'),
('6', '5'),
('7', '2'),
('7', '3'),
('8', '1'),
('8', '4'),
('9', '4'),
('9', '7');

INSERT INTO `message` (`id`, `userId`, `conversationId`, `txt`) VALUES
('1', '3', '1', 'Hey Bret!'),
('2', '1', '1', 'Hi! Hope you\'re having a good morning :)'),
('3', '3', '1', 'Yeah, definitely - I wanted to hear if you could help me coordinate a bit on something?'),
('4', '1', '1', 'Sure?'),
('5', '3', '1', 'I wanted to do something special for the team today, so was thinking of bringing some cake on Thursday. Have any good recommendations?'),
('6', '1', '1', 'Such a lovely idea :D Sure, there\'s a Lagekage Huset nearby'),
('7', '1', '1', 'They have excellent cakes!'),
('8', '3', '1', 'Great, thanks!'),
('9', '1', '1', 'Cheers!'),
('10', '3', '2', 'Hey John'),
('11', '2', '2', 'Hey Maline, what can I help with?'),
('12', '3', '2', 'Oh, nevermind, the bug dissapeared :) '),
('13', '4', '3', 'Hey all!'),
('14', '1', '3', 'Hey!'),
('15', '6', '3', 'Yeah?'),
('16', '4', '3', 'Are you all in today?'),
('17', '7', '3', 'Hey! Yeah, I\'m in today'),
('18', '6', '3', 'Me too!'),
('19', '1', '3', 'I won\'t be until later'),
('20', '4', '4', 'Emilie? You online yet?'),
('21', '7', '5', 'Morning John!'),
('22', '7', '5', 'I had a bit of a problem down in the Blue Room, could you help me?'),
('23', '2', '5', 'Sure! Heading there now :) '),
('24', '3', '6', 'Hey!'),
('25', '5', '6', 'Morning Maline :)'),
('26', '3', '6', 'Do you happen to have the latest update on the EFYS Revision?'),
('27', '5', '6', 'Yeah, I\'ll send it to you right now'),
('28', '2', '7', 'Hey'),
('29', '2', '7', 'Ops! I meant to send that to Alex, sorry!'),
('30', '4', '8', 'What a beautiful day today, Bret :) '),
('31', '4', '8', 'Do you think it makes sense to make a field trip today, maybe with some cake and such?'),
('32', '1', '8', 'I think that\'s a lovely idea!'),
('33', '1', '8', 'Anything I can help with?'),
('34', '4', '8', 'Yeah! If you could pick up the cake from the bakery before lunch, that\'d be swell'),
('35', '7', '9', 'Blake?'),
('36', '7', '9', 'When you get to work tomorrow, could you make sure to unlock all doors?');
