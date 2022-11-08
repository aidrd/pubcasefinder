#!/usr/bin/perl



#
#ver.3: 1. add hpo id to the key.
#	   2. remove DEFINITION
#
#
#ver.4: 0. for hpo data(HPO-japanese.20220414.txt)
#	   1. add parameter to specify the type of output: for text2hpo or for textinput
#	   2. check if all of the ids from file are stored at mysql db
#	   3. check if all of the ids from mysql db can be found at file
#	   4. complete the definition with the obo file
#
#ver.4.1: for hpo data(HPO-japanese.20221104.txt),no header line

use strict;
use DBI;
use utf8;


if ($#ARGV < 3) {
	print STDERR "Usage: $0 [hpo file] [obo file] [output filename prefix] [if check id consistency]\n";
	exit 1;
}

my $hpo_filename = shift;
my $obo_filename = shift;
my $output_filename_prefix = shift;
my $if_check_id_consistency = shift;

our $DB_NAME = "pubcases";
our $DB_USER = "pubcase";
our $DB_PASS = "pubcase0712";
our $DB_HOST = "localhost";
our $DB_PORT = "3306";


my $dbh = DBI->connect("dbi:mysql:dbname=$DB_NAME;host=$DB_HOST;port=$DB_PORT","$DB_USER","$DB_PASS") or die "$!\n Error: failed to connect to DB.\n";
$dbh->do("set names utf8"); 

#my $sth = $dbh->prepare("SELECT OntoID,OntoName,OntoNameJa,OntoSynonym,OntoDefinition FROM OntoTermHPInformation;");
#$sth->execute();
#while (my $ary_ref = $sth->fetchrow_arrayref) {
#	my ($hpo_id,$name,$name_ja,$synonym,$def) = @$ary_ref;
#}
#$sth->finish;


my %hpo_file = &_get_hpo_from_hpo_file($hpo_filename);
my %hpo_db   = &_get_hpo_from_db();

if($if_check_id_consistency ne 'no'){
	&_check_consistency(\%hpo_file,\%hpo_db, $hpo_filename);
}

my %hpo_def = &_get_hpo_def_from_obo_file($obo_filename);

&_combine_hpo_info(\%hpo_file,\%hpo_db, \%hpo_def);


my %dic_hash = &_get_dic(\%hpo_db);

my @sorted = sort { length $b <=> length $a } keys %dic_hash;

my $len = scalar @sorted;

for(my $i = $len -1; $i >= 0; $i--){

	my ($key,$tmp) = split('-HP',$sorted[$i]);

	my @parents = ();
	for(my $j = $i-1 ; $j >= 0; $j--){
		my ($key_long,$tmp_long) = split('-HP',$sorted[$j]);
		my $idx = index($key_long, $key);
		if($idx >= 0){
			push @parents, $j;
		}
	}

	my $parents_str = "";
	if(scalar @parents > 0) {
		$parents_str = join ",",@parents;
	}

	$dic_hash{$sorted[$i]}{'parents'} = $parents_str;
}

my $outfile_fortext2hpo  = $output_filename_prefix . "text2hpo.txt";
open(my $fh_text2hpo, '>', $outfile_fortext2hpo) or die "Could not open file '$outfile_fortext2hpo' $!";

my $outfile_fortextinput = $output_filename_prefix . "textinput.txt";
open(my $fh_textinput, '>', $outfile_fortextinput) or die "Could not open file '$outfile_fortextinput' $!";



print $fh_text2hpo "SEARCH_KEY\tPARENTS\tHPO_ID\tET\tJT\n";
print $fh_textinput "SEARCH_KEY\tPARENTS\tHPO_ID\tET\tJT\n";

for(my $idx = 0; $idx <$len; $idx++){

	my $key    = $sorted[$idx];
	my $hpo_id = $dic_hash{$key}{'hpo_id'};

	my ($search_key,$tmp) = split('-HP',$key);


	my $line =	$search_key                . "\t" .
				$dic_hash{$key}{'parents'} . "\t" .
				$hpo_id                    . "\t" .
				$dic_hash{$key}{'name'}    . "\t" .
				$dic_hash{$key}{'name_ja'};

	print $fh_text2hpo $line,"\n";
	print $fh_textinput $line,"\n";
}
close($fh_textinput); 

print $fh_text2hpo "DEFINITION:\n";
foreach my $hpo_id (sort keys %hpo_db){
	print $fh_text2hpo $hpo_id,"\t",$hpo_db{$hpo_id}{'def'},"\n";
}
close($fh_text2hpo); 

$dbh->disconnect;

print "Done!\n";
exit;


sub _get_dic {
	my ($hpo_db) = @_;
	my %dic_hash = ();
	
	foreach my $hpo_id (keys %{$hpo_db}){
		
		my @key_lst = ();

		push(@key_lst, $hpo_id . "-" .$hpo_id);
		
		my $name_en = $hpo_db->{$hpo_id}{'name_en'};
		push(@key_lst, uc($name_en) . "-" .$hpo_id);

		my $name_ja = "";
		if(exists $hpo_db->{$hpo_id}{'name_ja'} && $hpo_db->{$hpo_id}{'name_ja'} ne ""){
			$name_ja = $hpo_db->{$hpo_id}{'name_ja'};
			push(@key_lst, $name_ja . "-" .$hpo_id);
		}
		
		if(exists $hpo_db->{$hpo_id}{'synonym_en'}){
			foreach my $synonym_en (keys %{$hpo_db->{$hpo_id}{'synonym_en'}}){
				push(@key_lst, uc($synonym_en) . "-" .$hpo_id);
			}
		}

		if(exists $hpo_db->{$hpo_id}{'synonym_ja'}){
			foreach my $synonym_ja (keys %{$hpo_db->{$hpo_id}{'synonym_ja'}}){
				push(@key_lst, $synonym_ja . "-" .$hpo_id);
			}
		}

		foreach my $search_key (@key_lst){
			if(!exists $dic_hash{$search_key}){
				$dic_hash{$search_key} = {};
				$dic_hash{$search_key}{'hpo_id'}  = $hpo_id;
				$dic_hash{$search_key}{'name'}    = $name_en;
				$dic_hash{$search_key}{'name_ja'} = $name_ja;
			}
		}
	}
	
	return %dic_hash;
}



sub _combine_hpo_info {
	my ($hpo_file, $hpo_db, $hpo_def) = @_;

	my $num_name_ja_completed = 0;
	my $num_def_completed = 0;
	foreach my $hpo_id (keys %{$hpo_db}){

		if($hpo_db->{$hpo_id}{'def'} eq "" && exists $hpo_def->{$hpo_id} && $hpo_def->{$hpo_id} ne ""){
			$hpo_db->{$hpo_id}{'def'} = $hpo_def->{$hpo_id};
			$num_def_completed++;
		}
		
		#if($hpo_db->{$hpo_id}{'def'} eq ""){
		#	print "empty hpo definition [$hpo_id]\n";
		#}

		next if(!(exists $hpo_file->{$hpo_id}));

		if(exists $hpo_file->{$hpo_id}{'synonym_en'}){
			foreach my $hpo_name_en (keys %{$hpo_file->{$hpo_id}{'synonym_en'}}){
				$hpo_db->{$hpo_id}{'synonym_en'}{$hpo_name_en} = 1;
			}
		}

		my $hpo_name_ja_synonym1 = ""; 
		if(exists $hpo_file->{$hpo_id}{'synonym_ja'}){
			foreach my $hpo_name_ja (keys %{$hpo_file->{$hpo_id}{'synonym_ja'}}){
				$hpo_db->{$hpo_id}{'synonym_ja'}{$hpo_name_ja} = 1;
				if($hpo_name_ja_synonym1 eq ""){
					$hpo_name_ja_synonym1 = $hpo_name_ja;
				}
			}
		}

		if(!(exists $hpo_db->{$hpo_id}{'name_ja'}) || $hpo_db->{$hpo_id}{'name_ja'} eq "" ){
			if(exists $hpo_file->{$hpo_id}{'name_ja'}){
				$hpo_db->{$hpo_id}{'name_ja'} = $hpo_file->{$hpo_id}{'name_ja'};
				$num_name_ja_completed++;
			}else{
				$hpo_db->{$hpo_id}{'name_ja'} = $hpo_name_ja_synonym1;
				if($hpo_name_ja_synonym1 ne ""){
					$num_name_ja_completed++;
				} 
			}
		}
	}
	
	print STDERR  "$num_name_ja_completed name_ja were completed with hpo file.\n";
	print STDERR  "$num_def_completed definition were completed with obo data.\n";
}

sub _check_consistency {
	my ($hpo_file, $hpo_db, $infile) = @_;
	print "start checking consistency \n";
	
	my @not_found_in_db = ();
	foreach my $hpo_id (keys %{$hpo_file}){
		if(!(exists $hpo_db->{$hpo_id})){
			push(@not_found_in_db, $hpo_id);
		}
	}
	
	my $num1 = scalar @not_found_in_db; 
	print STDERR "$num1 ids from file($infile) which were not found at db(OntoTermHPInformation)\n";
	
	my @not_found_in_file = ();
	foreach my $hpo_id (keys %{$hpo_db}){
		if(!(exists $hpo_file->{$hpo_id})){
			push(@not_found_in_file, $hpo_id);
		}
	}
	my $num2 = scalar @not_found_in_file;
	print STDERR "$num2 ids from db which were not found at file($infile)\n";
	
	#print "### HPO IDs which not found at mysql db(OntoTermHPInformation) ### \n";	
	#foreach my $hpo_id (@not_found_in_db){
	#	print  $hpo_id,"\n";
	#}
}

sub _get_hpo_from_db {
	
	my %data = ();
		
	my $sth = $dbh->prepare("SELECT A.OntoID,A.OntoName,A.OntoNameJa,A.OntoSynonym,A.OntoDefinition FROM OntoTermHPInformation as A, IndexFormHP as B where A.OntoID=B.uid AND A.OntoID NOT in (SELECT OntoDescendantID FROM OntoTermHPDescendant WHERE OntoID='HP:0000005') AND A.OntoID != 'HP:0000118'");
	$sth->execute();
	while (my $ary_ref = $sth->fetchrow_arrayref) {
	
		my ($hpo_id,$name,$name_ja,$synonym,$def) = @$ary_ref;
	
		$def =~ s/^\s+|\s+$//g ;
		$data{$hpo_id}{'def'} = $def;
		
		$name =~ s/^\s+|\s+$//g ;
		if($name ne ""){
			$data{$hpo_id}{'synonym_en'}{$name} = 1;
			$data{$hpo_id}{'name_en'} = $name;
		}

		$name_ja =~ s/^\s+|\s+$//g ;
		if($name_ja ne ""){
			$data{$hpo_id}{'synonym_ja'}{$name_ja} = 1;
			$data{$hpo_id}{'name_ja'} = $name_ja;
		}
	
		if($synonym ne ''){
			my @lst = split(/\|/,$synonym);
			foreach my $syn (@lst){
				$syn =~ s/^\s+|\s+$//g ;
				if($syn ne ""){
					$data{$hpo_id}{'synonym_en'}{$syn} = 1;
				}
			}
		}
	}
	$sth->finish;	
	
	return %data;
}

sub _get_hpo_from_hpo_file {
	my ($filename) = @_;
	
	open(my $in, $filename) or die($!);
	#my $head_line = <$in>;
	
	my %data = ();

	while(defined (my $line = <$in>)){
		chomp ($line);
		my @fields = split("\t", $line);
	
		my $hpo_id        = $fields[0];
		my $English_term  = $fields[1];
		my $Japanese_term = $fields[2];
		my $Source        = $fields[3];
		my $label         = $fields[4];
		
		$English_term =~ s/^\s+|\s+$//g;
		$Japanese_term =~ s/^\s+|\s+$//g;
		
		if($label eq "label"){
			$data{$hpo_id}{'name_en'} = $English_term;
			$data{$hpo_id}{'name_ja'} = $Japanese_term;
		}elsif($label eq "synonym"){
		}else{
			print STDERR "unknown label at file[$label]\n";
		}

		if($English_term ne ""){
			$data{$hpo_id}{'synonym_en'}{$English_term} = 1;
		}
		
		if($Japanese_term ne ""){
			$data{$hpo_id}{'synonym_ja'}{$Japanese_term} = 1;
		}
	}
	close($in);	
	
	return %data;
}

sub _get_hpo_def_from_obo_file {
	my ($filename) = @_;

	my %hpo_def_lst = ();
	my $id = "";
	my $def = "";

	my $in;
	open($in, $filename) or die($!);

	while(defined (my $line = <$in>)){
		chomp ($line);
		if($line =~ /\[Term\]/){
			if($id ne ""){
				$hpo_def_lst{$id} = $def;
			}
			$id = "";
			$def = "";
		}elsif($line =~ /^id\: (.*)/){
			$id = $1;
		}elsif($line =~ /^def\: (.*)/){
			$def = $1;
			my $idx1 = index($def, '"');
			if($idx1 >= 0){
				my $idx2 = index($def, '"', $idx1 + 1);
				$def = substr($def, $idx1+1, $idx2 - $idx1 -1);
			}
		}
	}
	close $in;

	if($id ne "" && $def ne ""){
		$hpo_def_lst{$id} = $def;
	}
	return %hpo_def_lst;
}

