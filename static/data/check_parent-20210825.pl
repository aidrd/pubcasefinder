#!/usr/bin/perl

my $file = shift;
my $hpo_def_file = shift;

my %hpo_def_lst = &_read_hpo_def($hpo_def_file);


open(FH, $file) or die($!);
my $head_line = <FH>;
chomp ($head_line);

my %data = ();
my @lst_keys = ();

while(defined ($line = <FH>)){
    chomp ($line);
    my @fields = split("\t", $line);

    my $ID = $fields[0];
    my $English_term =  $fields[1];
    $English_term =~ s/^\s+|\s+$//g;
    my $Japanese_term = $fields[2];

    my $def = "";
    if(exists $hpo_def_lst{$ID}){
        $def = $hpo_def_lst{$ID};
    }

    my $key = $Japanese_term;

    $key =~ s/^\s+|\s+$//g;

    my $line1 = "$ID\t$English_term\t$Japanese_term\t$def\t1";
    my $line2 = "$ID\t$English_term\t$Japanese_term\t$def\t0";

    $key = "$key-$ID";

    if(exists $data{$key}){
        print STDERR "INFO: duplicated key $ID \n";
    } else {
        $data{$key} = $line1;
        push @lst_keys, $key;
    }

    my $key_en = uc($English_term);
    $key_en = "$key_en-$ID";
    if(exists $data{$key_en}){
        print STDERR "INFO: duplicated EN key $key_en \n";
    } else {
        $data{$key_en} = $line2;
        push @lst_keys, $key_en;
    }

}
close(FH);

@sorted = sort { length $b <=> length $a } @lst_keys;

#print "no\tSEARCH_KEY\tPARENTS\tHPO_ID\tET\tJT_E\tJT_L\tJT_M\tJT_G\n";
#print "SEARCH_KEY\tPARENTS\tHPO_ID\tET\tJT\tDEF\tFLAG\n";
print "PARENTS\tHPO_ID\tET\tJT\tDEF\tFLAG\n";

my $len = scalar @sorted;

for(my $i = $len -1; $i >= 0; $i--){

    my ($key,$tmp) = split('-HP',$sorted[$i]);

    my @parents = ();
    for(my $j = $i-1 ; $j >= 0; $j--){
        my ($key_long,$tmp_long) = split('-HP',$sorted[$j]);
        my $idx = index($key_long, $key);
        #if($key_long ne $key && $idx >= 0){
        if($idx >= 0){
            push @parents, $j;
        }
    }

    my $parents_str = "";
    if(scalar @parents > 0) {
        $parents_str = join ",",@parents;
    }

    $data{$sorted[$i]} = $parents_str . "\t" . $data{$sorted[$i]};
}

for(my $idx = 0; $idx <$len; $idx++){
   my $key = $sorted[$idx];
   print  $data{$key},"\n";
}

exit;

sub _read_hpo_def {
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
