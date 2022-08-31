
use strict;
use warnings;

my $file = shift;

my $ref_label;
my $ref_synonym;

open(my $FH, $file) or die;
while(<$FH>){
    next if $_ =~ /^HPO ID/;
    $_ =~ s/[\r\n]*$//;
    my @items = split(/\t/, $_);
    my $hpo_id = $items[0];
    my $en = $items[1];
    my $ja = $items[2];

    if($items[4] eq "label"){
	$ref_label->{$hpo_id}->{$ja} = 1;
    }

    if($items[4] eq "synonym"){
	$ref_synonym->{$hpo_id}->{$ja} = 1;
    }
}
close($FH);


foreach my $hpo_id (sort {$a cmp $b} keys %{$ref_synonym}){
    my @synonyms = ();
    foreach my $ja (sort {$a cmp $b} keys %{$ref_synonym->{$hpo_id}}){
	push @synonyms, $ja;
    }
    print $hpo_id."\t".join("|", @synonyms)."\n";
}
