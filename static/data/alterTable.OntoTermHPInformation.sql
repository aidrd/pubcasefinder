-- MySQL dump 10.13  Distrib 5.7.36, for Linux (x86_64)
--
-- Host: localhost    Database: pubcases
-- ------------------------------------------------------
-- Server version	5.7.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


ALTER TABLE `OntoTermHPInformation` ADD `OntoSynonymJa` TEXT character set utf8 collate utf8_unicode_ci NOT NULL;
ALTER TABLE `OntoTermHPInformation` ADD `OntoDefinitionJa` TEXT character set utf8 collate utf8_unicode_ci NOT NULL;
ALTER TABLE `OntoTermHPInformation` ADD `OntoCommentJa` TEXT character set utf8 collate utf8_unicode_ci NOT NULL;

--
-- Table structure for table `OntoTermHPSynonymJa`
--

DROP TABLE IF EXISTS `OntoTermHPSynonymJa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `OntoTermHPSynonymJa` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `OntoVersion` varchar(30) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `OntoID` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `OntoSynonym` varchar(300) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `X_OntoTermHPSynonymJa_OntoVersion` (`OntoVersion`),
  KEY `X_OntoTermHPSynonymJa_OntoID` (`OntoID`),
  KEY `X_OntoTermHPSynonymJa_OntoSynonym` (`OntoSynonym`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OntoTermHPSynonymJa`
--

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-08-30 21:03:01
