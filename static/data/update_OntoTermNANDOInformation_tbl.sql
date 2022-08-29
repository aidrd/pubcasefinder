#ALTER TABLE OntoTermNANDO MODIFY COLUMN OntoTerm varchar(3000) character set utf8 collate utf8_unicode_ci NOT NULL;
#ALTER TABLE OntoTermNANDO MODIFY COLUMN OntoIDTerm varchar(3030) character set utf8 collate utf8_unicode_ci NOT NULL;

DROP TABLE IF EXISTS `OntoTermNANDOInformation`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `OntoTermNANDOInformation` (
  `id`                       int unsigned NOT NULL auto_increment,
  `OntoVersion`              varchar(30)   character set utf8 collate utf8_unicode_ci NOT NULL,
  `OntoID`                   varchar(100)  character set utf8 collate utf8_unicode_ci NOT NULL,
  `OntoName`                 varchar(300)  character set utf8 collate utf8_unicode_ci NOT NULL,
  `OntoSynonym`              varchar(4000) character set utf8 collate utf8_unicode_ci NOT NULL,
  `OntoDefinition`           varchar(3000) character set utf8 collate utf8_unicode_ci NOT NULL,
  `OntoComment`              varchar(3000) character set utf8 collate utf8_unicode_ci NOT NULL,
  `OntoAltIDs`               varchar(3000) character set utf8 collate utf8_unicode_ci NOT NULL,
  `OntoParentNum`            int unsigned NOT NULL default 0,
  `OntoChildNum`             int unsigned NOT NULL default 0,
  `OntoNameJa`               varchar(400)  character set utf8 collate utf8_unicode_ci NOT NULL,
  `OntoSynonymJa`            TEXT character set utf8 collate utf8_unicode_ci NOT NULL,
  `OntoDefinitionJa`         TEXT character set utf8 collate utf8_unicode_ci NOT NULL,
  `OntoCommentJa`            TEXT character set utf8 collate utf8_unicode_ci NOT NULL,
   PRIMARY KEY  (`id`),
   KEY `X_OntoTermNANDOInformation_OntoVersion` (`OntoVersion`),
   KEY `X_OntoTermNANDOInformation_OntoID` (`OntoID`),
   UNIQUE `X_OntoTermNANDOInformation_OntoVersion_OntoID` (`OntoVersion`,`OntoID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;;
SET character_set_client = @saved_cs_client;

#hierarchy


DROP TABLE IF EXISTS `OntoTermNANDOHierarchy`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `OntoTermNANDOHierarchy` (
  `id`                       int unsigned NOT NULL auto_increment,
  `OntoVersion`              varchar(30)   character set utf8 collate utf8_unicode_ci NOT NULL,
  `OntoID`                   varchar(100)  character set utf8 collate utf8_unicode_ci NOT NULL,
  `OntoParentID`             varchar(100)  character set utf8 collate utf8_unicode_ci NOT NULL,
   PRIMARY KEY  (`id`),
   KEY `X_OntoTermNANDOHierarchy_OntoVersion` (`OntoVersion`),
   KEY `X_OntoTermNANDOHierarchy_OntoID` (`OntoID`),
   KEY `X_OntoTermNANDOHierarchy_OntoParentID` (`OntoParentID`),
   UNIQUE `X_OntoTermNANDOHierarchy_OntoVersion_OntoID_OntoParentID` (`OntoVersion`,`OntoID`,`OntoParentID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;;
SET character_set_client = @saved_cs_client;


DROP TABLE IF EXISTS `OntoTermNANDOAncestor`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `OntoTermNANDOAncestor` (
  `id`                       int unsigned NOT NULL auto_increment,
  `OntoVersion`              varchar(30)   character set utf8 collate utf8_unicode_ci NOT NULL,
  `OntoID`                   varchar(100)  character set utf8 collate utf8_unicode_ci NOT NULL,
  `OntoAncestorID`           varchar(100)  character set utf8 collate utf8_unicode_ci NOT NULL,
   PRIMARY KEY  (`id`),
   KEY `X_OntoTermNANDOAncestor_OntoVersion` (`OntoVersion`),
   KEY `X_OntoTermNANDOAncestor_OntoID` (`OntoID`),
   KEY `X_OntoTermNANDOAncestor_OntoAncestorID` (`OntoAncestorID`),
   UNIQUE `X_OntoTermNANDOAncestor_OntoVersion_OntoID_OntoAncestorID` (`OntoVersion`,`OntoID`,`OntoAncestorID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;;
SET character_set_client = @saved_cs_client;


DROP TABLE IF EXISTS `OntoTermNANDODescendant`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `OntoTermNANDODescendant` (
  `id`                       int unsigned NOT NULL auto_increment,
  `OntoVersion`              varchar(30)   character set utf8 collate utf8_unicode_ci NOT NULL,
  `OntoID`                   varchar(100)  character set utf8 collate utf8_unicode_ci NOT NULL,
  `OntoDescendantID`         varchar(100)  character set utf8 collate utf8_unicode_ci NOT NULL,
   PRIMARY KEY  (`id`),
   KEY `X_OntoTermNANDODescendant_OntoVersion` (`OntoVersion`),
   KEY `X_OntoTermNANDODescendant_OntoID` (`OntoID`),
   KEY `X_OntoTermNANDODescendant_OntoDescendantID` (`OntoDescendantID`),
   UNIQUE `X_OntoTermNANDODescendant_OntoVersion_OntoID_OntoDescendantID` (`OntoVersion`,`OntoID`,`OntoDescendantID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;;
SET character_set_client = @saved_cs_client;


DROP TABLE IF EXISTS `OntoTermNANDOIntersection`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `OntoTermNANDOIntersection` (
  `id`                       int unsigned NOT NULL auto_increment,
  `OntoVersion`              varchar(30)   character set utf8 collate utf8_unicode_ci NOT NULL,
  `OntoID`                   varchar(100)  character set utf8 collate utf8_unicode_ci NOT NULL,
  `OntoIntType`              varchar(100)  character set utf8 collate utf8_unicode_ci NOT NULL,
  `OntoIntID`                varchar(100)  character set utf8 collate utf8_unicode_ci NOT NULL,
   PRIMARY KEY  (`id`),
   KEY `X_OntoTermNANDOIntersection_OntoVersion` (`OntoVersion`),
   KEY `X_OntoTermNANDOIntersection_OntoID` (`OntoID`),
   KEY `X_OntoTermNANDOIntersection_OntoIntType` (`OntoIntType`),
   KEY `X_OntoTermNANDOIntersection_OntoIntID` (`OntoIntID`),
   UNIQUE `X_OntoTermNANDOIntersection_Unique` (`OntoVersion`,`OntoID`,`OntoIntType`,`OntoIntID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;;
SET character_set_client = @saved_cs_client;


DROP TABLE IF EXISTS `OntoTermNANDODbxref`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `OntoTermNANDODbxref` (
  `id`                       int unsigned NOT NULL auto_increment,
  `OntoVersion`              varchar(30)   character set utf8 collate utf8_unicode_ci NOT NULL,
  `OntoID`                   varchar(100)  character set utf8 collate utf8_unicode_ci NOT NULL,
  `OntoDbxrefName`           varchar(100)  character set utf8 collate utf8_unicode_ci NOT NULL,
  `OntoDbxrefDb`             varchar(100)  character set utf8 collate utf8_unicode_ci NOT NULL,
  `OntoDbxrefAcc`            varchar(100)  character set utf8 collate utf8_unicode_ci NOT NULL,
  `OntoDbxrefDescription`    varchar(100)  character set utf8 collate utf8_unicode_ci NOT NULL,
  `OntoDbxrefModifier`       varchar(100)  character set utf8 collate utf8_unicode_ci NOT NULL,
   PRIMARY KEY  (`id`),
   KEY `X_OntoTermNANDODbxref_OntoVersion` (`OntoVersion`),
   KEY `X_OntoTermNANDODbxref_OntoID` (`OntoID`),
   UNIQUE `X_OntoTermNANDODbxref_Unique` (`OntoVersion`,`OntoID`,`OntoDbxrefName`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;;
SET character_set_client = @saved_cs_client;

#ALTER TABLE OntoTermNANDOInformation ADD COLUMN `index_OntoSynonym` varchar(3300);
#UPDATE OntoTermNANDOInformation SET index_OntoSynonym=OntoSynonym;
#ALTER TABLE OntoTermNANDOInformation MODIFY COLUMN index_OntoSynonym varchar(3300) NOT NULL;
#ALTER TABLE OntoTermNANDOInformation DROP COLUMN `index_OntoSynonym`;

##ALTER TABLE OntoTermNANDOInformation ADD KEY `X_OntoTermNANDOInformation_index_OntoSynonym` (`index_OntoSynonym`);


DROP TABLE IF EXISTS `OntoTermNANDOSynonym`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `OntoTermNANDOSynonym` (
  `id`                       int unsigned NOT NULL auto_increment,
  `OntoVersion`              varchar(30)   character set utf8 collate utf8_unicode_ci NOT NULL,
  `OntoID`                   varchar(100)  character set utf8 collate utf8_unicode_ci NOT NULL,
  `OntoSynonym`              varchar(1000)  character set utf8 collate utf8_unicode_ci NOT NULL,
   PRIMARY KEY  (`id`),
   KEY `X_OntoTermNANDOSynonym_OntoVersion` (`OntoVersion`),
   KEY `X_OntoTermNANDOSynonym_OntoID` (`OntoID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;;
SET character_set_client = @saved_cs_client;

