define([
  'dojo/_base/array',
  'dojo/Deferred',
  'image-load'
], function (
  array,
  Deferred,
  imageLoad
) {
  return{
    createDeckList: function (deck) {
      var doc = new jsPDF();

      //doc.setFont("courier");
      doc.setFontSize(14);
      doc.text(20, 20, 'Deck: ' +deck.title);
      doc.text(20, 25, 'Event: ' + deck.event);
      doc.text(20, 30, 'Player: ' + deck.player);

      doc.line(20, 32, 200, 32); // horizontal line


      doc.setFontSize(12);
      var y = 40;
      deck.cards.fetchSync().forEach(function(card) {
        doc.text(20, y, card.name + ' (' + card.expansion + ') x ' + card.quantity);
        y += 5;
      });

      return doc;
    },

    createImages: function (deck) {
      //var pdf = this._getImageFromUrl('/cards/starwars/ANewHope-Dark/large/advosze.gif', this._createImagePdf);
      // To configure the loader, pass an options hash as the first parameter.
      var doc = new jsPDF();
      var deferred = new Deferred();

      imageLoad({
        // a src root for relative URLs. May itself be relative or absolute.
        srcRoot: '/app/resources',

        // Attributes applied to each image when not already specified for the image
        defaultAttributes: {
          width: 24,
          height: 24
        }
      },[
        '/cards/starwars/ANewHope-Dark/large/advosze.gif',
        '/cards/starwars/ANewHope-Dark/large/advosze.gif'
      ]).then(function(imageArray){
        // Enjoy an array of uniformly-sized images.
        var x = 0,
          y = 0;

        array.forEach((imageArray), function (image) {
          doc.addImage(image, 'JPEG', x, y);
          x += 30;
          y += 30;
        });

        deferred.resolve(doc);
      });

      return deferred;
    }
  };
});