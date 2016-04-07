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
      var deferred = new Deferred();
      var doc = new jsPDF('portrait', 'mm', 'a4');
      var imageList = [];

      deck.fetchSync().forEach(function(card) {
        var copies;
        for (copies = 0; copies < card.quantity; copies++) {
          imageList.push( {
              src: card.image_path + card.image,
              alt: card.image_path + card.image
          });
          if (card.image_path_back) {
            imageList.push(card.image_path + card.image_back);
          }
        }
      }, this);


      var cardWidth = 63;
      var cardHeight = 88;
      imageLoad({
        // a src root for relative URLs. May itself be relative or absolute.
        srcRoot: '/app/resources/cards',

        // Attributes applied to each image when not already specified for the image
        defaultAttributes: {
          //width: cardWidth,
          //height: cardHeight
        }
      }, imageList).then(function(imageArray){
        // Enjoy an array of uniformly-sized images.
        var x = 10,
          y = 10,
          cardNr = 1;

        array.forEach((imageArray), function (image) {
          var rotation = (image.width > image.height)? 90 : 0;
          doc.addImage(image, 'JPEG', x, y, cardWidth, cardHeight, image.alt, null, rotation);

          if (cardNr % 9 === 0 && cardNr < imageArray.length) {
            doc.addPage();
            x = 10;
            y = 10;
          }
          else {
            if (cardNr % 3 === 0) {
              x = 10;
              y += cardHeight;
            }
            else {
              x += cardWidth;
            }
          }
          cardNr += 1;
        });

        deferred.resolve(doc);
      });

      return deferred;
    }
  };
});