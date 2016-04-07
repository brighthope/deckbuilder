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

    _createPath: function (wrongPath) {
      var imageSet = wrongPath.split('/')[2];
      var imageName = wrongPath.split('/')[3];
      imageName = imageName.substring(2);
      return '/cards/starwars/' + imageSet + '/large/' + imageName + '.gif';
    },

    _createBackPath: function (wrongPath) {
      var imageSet = wrongPath.split('/')[2];
      var imageNameBack = wrongPath.split('/')[3].substring(2);
      return '/cards/starwars/' + imageSet + '/large/' + imageNameBack + '.gif';
    },

    createImages: function (deck) {
      var deferred = new Deferred();
      //var pdf = this._getImageFromUrl('/cards/starwars/ANewHope-Dark/large/advosze.gif', this._createImagePdf);
      // To configure the loader, pass an options hash as the first parameter.
      var doc = new jsPDF('portrait', 'mm', 'a4');
      var imageList = [];
      deck.fetchSync().forEach(function(card) {
        var copies;
        for (copies = 0; copies < card.quantity; copies++) {
          imageList.push(this._createPath(card.image_path));
          if (card.image_path_back) {
            imageList.push(this._createBackPath(card.image_path_back));
          }
        }
      }, this);


      var cardWidth = 63;
      var cardHeight = 88;
      imageLoad({
        // a src root for relative URLs. May itself be relative or absolute.
        srcRoot: '/app/resources',

        // Attributes applied to each image when not already specified for the image
        defaultAttributes: {
          //width: cardWidth,
          //height: cardHeight
        }
      }, imageList).then(function(imageArray){
        // Enjoy an array of uniformly-sized images.
        var x = 10,
          y = 10;

        array.forEach((imageArray), function (image) {
          doc.addImage(image, 'JPEG', x, y, cardWidth, cardHeight);
          x += cardWidth;
          y += 0;
        });

        deferred.resolve(doc);
      });

      return deferred;
    }
  };
});