#!/usr/bin/perl

use strict;
use warnings;
use POSIX qw(strftime);
use DateTime;


my $today = DateTime->now(time_zone => 'local');
my $yesterday = $today->clone->add(days => -1);
my $subfix = $yesterday->strftime("%Y%m%d");

opendir(DIR, ".");
my @files = grep(/\.js$/,readdir(DIR));
closedir(DIR);

# print all the filenames in our array
foreach my $file (@files) {
  my $newfile = "backup/" . $file . "." . $subfix;
  if(-f $newfile){
    print STDERR "already existed [" . $newfile . "]\n";
  }else{
	system("cp $file $newfile");
  }
}

print "done!\n";
