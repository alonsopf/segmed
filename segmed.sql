CREATE DATABASE segmed;
USE segmed;
CREATE TABLE `users` (
  `idUsuario` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `confirm` int(11) NOT NULL,
  `pass` varchar(255) NOT NULL,
  `iosToken` varchar(255) NOT NULL,
  `androidToken` varchar(255) NOT NULL,
  `accountType` varchar(1) NOT NULL,
  `cellphone` varchar(30) NOT NULL,
  `cellphoneVerified` varchar(1) NOT NULL,
  `hashConfirm` varchar(255) NOT NULL,
  `hashReset` varchar(255) NOT NULL,
  `idFacebook` varchar(100) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

ALTER TABLE `users` ADD PRIMARY KEY (`idUsuario`);
ALTER TABLE `users` MODIFY `idUsuario` int(11) NOT NULL AUTO_INCREMENT;

CREATE TABLE `tokens` (
  `idUsuario` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expiredAt` varchar(30) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE `savedImages` (
  `idImage` int(11) NOT NULL,
  `UnsplashID` varchar(55) NOT NULL,
  `idUsuario` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `s3url` varchar(255) NOT NULL,
  `likeTime` varchar(30) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
-- status: 1 like, status 0 not like

ALTER TABLE `savedImages` ADD PRIMARY KEY (`idImage`);
ALTER TABLE `savedImages` MODIFY `idImage` int(11) NOT NULL AUTO_INCREMENT;

CREATE TABLE `sendSMS` (
  `number` varchar(55) NOT NULL,
  `confirm` varchar(7) NOT NULL,
  `timestamp` varchar(30) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


INSERT INTO `users` (name,email,confirm,pass,iosToken,androidToken,accountType, cellphone,cellphoneVerified, hashConfirm, hashReset, idFacebook) VALUES ('Fernando Alonso Pecina', 'alonsopf@gmail.com',1,'3OFSSdaMOMMiEJOAuq/uSiZVjpyte2ADF28yOvuEAOqaW20z5npFdkoVPE1YRJ8jowZp4p7PuglekpHolApRcw==','','','1','','','','','');
INSERT INTO `users` (name,email,confirm,pass,iosToken,androidToken,accountType, cellphone,cellphoneVerified, hashConfirm, hashReset, idFacebook) VALUES ('Adam Koszek', 'adam@segmed.ai',1,'3OFSSdaMOMMiEJOAuq/uSiZVjpyte2ADF28yOvuEAOqaW20z5npFdkoVPE1YRJ8jowZp4p7PuglekpHolApRcw==','','','3','','','','','');
