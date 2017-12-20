/*
const Spooky = require('spooky');

var spooky = new Spooky({
    casper: {
      //configure casperjs here
    }
  }, function (err) {
    // NODE CONTEXT
    console.log('We in the Node context');
    spooky.start('http://www.mysite.com');
    spooky.then(function() {
      // CASPERJS CONTEXT
      console.log('We in the CasperJS context');
      this.emit('consoleWe can also emit events here.');
      this.click('a#somelink  });
    spooky.then(function() {
      // CASPERJS CONTEXT
      var size = this.evaluate(function() {
      // PAGE CONTEXT
      console.log('....'); // DOES NOT GET PRINTED OUT
      __utils__.echo('We in the Page context'); // Gets printed out
      this.capture('screenshot.png');
      var $selectsize = $('select#myselectlist option').size();
        return $selectsize;
      })
    })
    */