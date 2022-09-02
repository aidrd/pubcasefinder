#!/usr/bin/perl



#
#ver1.0:1. retrieve synonym data from file and save into database
#		2. 
#

use strict;
use DBI;
use utf8;


if ($#ARGV < 0) {
	print STDERR "Usage: $0 [hpo file(for example: HPO-japanese.20220414.txt)]\n";
	exit 1;
}

my $hpo_filename = shift;

our $DB_NAME = "pubcases";
our $DB_USER = "pubcase";
our $DB_PASS = "pubcase0712";
our $DB_HOST = "localhost";
our $DB_PORT = "3306";


my $dbh = DBI->connect("dbi:mysql:dbname=$DB_NAME;host=$DB_HOST;port=$DB_PORT","$DB_USER","$DB_PASS") or die "$!\n Error: failed to connect to DB.\n";
$dbh->do("set names utf8"); 

my %hpo_file = &_get_hpo_from_hpo_file($hpo_filename);
my %hpo_db   = &_get_hpo_from_db();

my $sth1 = $dbh->prepare("INSERT INTO OntoTermHPSynonymJa(OntoID,OntoSynonym,OntoVersion) VALUES (?,?,'')");
my $sth2 = $dbh->prepare("UPDATE OntoTermHPInformation SET OntoSynonymJa=? WHERE OntoID = ?");


foreach my $hpo_id (sort keys %hpo_db){
	my %synonym_hash = ();

	if($hpo_db{$hpo_id}{'name_ja'} ne ""){
		my $name_ja = $hpo_db{$hpo_id}{'name_ja'};
		$synonym_hash{$name_ja} = 1;
	}
	
	if(exists $hpo_file{$hpo_id}){
		if(exists $hpo_file{$hpo_id}{'name_ja'}){
			my $name_ja = $hpo_file{$hpo_id}{'name_ja'};
			$synonym_hash{$name_ja} = 1;
		}
		
		if(exists $hpo_file{$hpo_id}{'synonym_ja'}){
			foreach my $syn (keys %{$hpo_file{$hpo_id}{'synonym_ja'}}){
				$synonym_hash{$syn} = 1;
			}
		}
	}
	
	foreach my $synonym (keys %synonym_hash){
		$sth1->execute($hpo_id . "_ja", $synonym);
	}

	my $name_ja = $hpo_db{$hpo_id}{'name_ja'};
	if($name_ja ne ""){
		delete $synonym_hash{$name_ja};
	}

	my @l = keys %synonym_hash;
	if(scalar @l > 0){
		my $synonym_str = join("|", @l);
		$sth2->execute($synonym_str,$hpo_id);
	}
}

$dbh->disconnect;
print "Done!\n";
exit;

sub _get_hpo_from_db {
	my %data = ();
	my $sth = $dbh->prepare("SELECT OntoID,OntoNameJa FROM OntoTermHPInformation where OntoID NOT IN (SELECT OntoDescendantID FROM OntoTermHPDescendant WHERE OntoID='HP:0000005') AND OntoID!='HP:0000118'");
	$sth->execute();
	while (my $ary_ref = $sth->fetchrow_arrayref) {
		my ($hpo_id,$name_ja) = @$ary_ref;
		$name_ja =~ s/^\s+|\s+$//g ;
		$data{$hpo_id}{'name_ja'} = $name_ja;
	}
	$sth->finish;	
	return %data;
}

sub _get_hpo_from_hpo_file {
	my ($filename) = @_;
	open(my $in, $filename) or die($!);

	my $head_line = <$in>;
	
	my %data = ();

	while(defined (my $line = <$in>)){
		chomp ($line);
		my @fields = split("\t", $line);
	
		my $hpo_id        = $fields[0];
		my $Japanese_term = $fields[2];
		my $label         = $fields[4];
		
		$Japanese_term =~ s/^\s+|\s+$//g;
		
		if($label eq "label"){
			$data{$hpo_id}{'name_ja'} = $Japanese_term;
		}elsif($label eq "synonym"){
		}else{
			print STDERR "unknown label at file[$label]\n";
		}

		if($Japanese_term ne ""){
			$data{$hpo_id}{'synonym_ja'}{$Japanese_term} = 1;
		}
	}
	close($in);	
	
	return %data;
}


