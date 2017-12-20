/**
 * A script to upload a file to fathom. This is meant to be run from a docker container.
 * Run with:
 * docker run -v `pwd`/casper/submitForm.js:/home/casperjs/script.js vidiben/casperjs
 */

const casper = require("casper").create();

const fathomLogin = 'doug.boyd@runningmanspirits.com.au';
const fathomPassword = 's-19NKB39';
const fathomCompanyId = '143664';

// print out all the messages in the headless browser context
casper.on('remote.message', function(msg) {
    this.echo('remote message caught: ' + msg);
});

// print out all the messages in the headless browser context
casper.on("page.error", function(msg, trace) {
    this.echo("Page Error: " + msg, "ERROR");
});

// Open the first page...login...
casper.start("https://app.fathomhq.com/login", function() {
  this.echo(this.getTitle());

  if (this.exists("div#login-box > form")) {
    this.echo("found it");
  } else {
    this.echo("no joy");
  }
});

// Fill out the login form
// NOTE - do NOT submit it.
casper.then(function() {
  this.fill(
    "div#login-box > form",
    {
      email: fathomLogin,
      password: fathomPassword
    },
    false
  );
});

// Submit it
casper.then(function() {
  this.click("#login-button");
});

// Load up the company page
fathomCompanyPage = 'https://app.fathomhq.com/company/sourcedata?id=' + fathomCompanyId;
casper.thenOpen(fathomCompanyPage);

// click the UPDATE FROM EXCEL button
casper.then(function() {
  this.click("#update-financials-button");
});

casper.thenEvaluate(function(){
    console.log("Page Title " + document.title);
 });

/*

casper.then(function() {
  this.echo(this.getTitle());
});
*/

/*
casper.thenOpen('http://phantomjs.org', function() {
    this.echo(this.getTitle());
});
*/

casper.run();
