#!/usr/bin/perl

use strict;
use DBI;
use utf8;
use Encode;
use LWP::UserAgent;
use Data::Dumper;
use URI::Escape;
use JSON;

our $URL_PANELS = "https://panelapp.agha.umccr.org/api/v1/panels/";

our $DB_NAME = "";
our $DB_USER = "";
our $DB_PASS = "";
our $DB_HOST = "";
our $DB_PORT = "";
my $dbh = DBI->connect("dbi:mysql:dbname=$DB_NAME;host=$DB_HOST;port=$DB_PORT","$DB_USER","$DB_PASS") or die "$!\n Error: failed to connect to DB.\n";
$dbh->do("set names utf8");

my %gene_hash = ();
&load_genes(\%gene_hash);

my @panel_list = &load_panels($URL_PANELS);

my $max_len = 0;


my $sth1 = $dbh->prepare("INSERT INTO vgpau(panel_id,panel_name) VALUES (?,?)");
my $sth2 = $dbh->prepare("INSERT INTO vgpau_genes(panel_id,gene_id,gene_name) VALUES (?,?,?)");

foreach my $panel (@panel_list) {

	my $panel_id   = $panel->{'id'};
	my $panel_name = $panel->{'name'};

	$sth1->execute('PAA:'. $panel_id, $panel_name);

	my $panel_detail_url = $URL_PANELS . $panel_id . "/";

    my $ua = LWP::UserAgent->new(ssl_opts => { verify_hostname => 1 });
    my $header = HTTP::Request->new(GET => $panel_detail_url);
    my $request = HTTP::Request->new('GET', $panel_detail_url, $header);
    my $response = $ua->request($request);
    if ($response->is_success){
		my $json = decode_json($response->content);
        for my $gene (@{$json->{'genes'}}){
			my $gene_symbol = $gene->{'gene_data'}{'hgnc_symbol'};
			if(exists($gene_hash{$gene_symbol})){
				my $gene_id = $gene_hash{$gene_symbol};
				$sth2->execute('PAA:'. $panel_id, 'ENT:' .$gene_id, $gene_symbol);
			}else{
				print STDERR "ERROR: no id found for panel($panel_id) gene symbol $gene_symbol\n" ;
				exit;
			}
		}
	}

	print "insert $panel_id\t$panel_name\n";
}



$dbh->disconnect;

exit;


sub load_genes{
	my $gene_hash = shift;
	my $sth = $dbh->prepare("SELECT GeneName,EntrezID FROM GeneName2ID;");
	$sth->execute();
	while (my $ary_ref = $sth->fetchrow_arrayref) {
		my ($gene_name,$gene_id) = @$ary_ref;
		$gene_hash->{$gene_name} = $gene_id;
	}
	$sth->finish;

}




sub load_panel_genes{

}

sub load_panels{
	my $url_panels = shift;
	my @retLst = ();

	my $ua = LWP::UserAgent->new(ssl_opts => { verify_hostname => 1 });
	my $header = HTTP::Request->new(GET => $url_panels);
	my $request = HTTP::Request->new('GET', $url_panels, $header);
	my $response = $ua->request($request);

	if ($response->is_success){
		#print Dumper($response->content)
	    my $json = decode_json($response->content);
		#print $json->{'count'},"\n";
		#print $json->{'next'},"\n";
		for my $panel (@{$json->{'results'}}){
			push(@retLst, $panel);
			#print $panel->{'id'},"\t",$panel->{'name'},"\n";
		}

		my $next = $json->{'next'};
		while($next && $next ne 'null'){
			my $ua1 = LWP::UserAgent->new(ssl_opts => { verify_hostname => 1 });
			my $header1 = HTTP::Request->new(GET => $next);
			my $request1 = HTTP::Request->new('GET', $next, $header1);
			my $response1 = $ua->request($request1);
			my $json1 = decode_json($response1->content);
			for my $panel (@{$json1->{'results'}}){
				push(@retLst, $panel);
				#print $panel->{'id'},"\t",$panel->{'name'},"\n";
		    }
	
			$next = $json1->{'next'};
		}

	}elsif ($response->is_error){
    	print "Error:$URL_PANELS\n";
	    print $response->error_as_HTML;
	}

	return @retLst;
}
