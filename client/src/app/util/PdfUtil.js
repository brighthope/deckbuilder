define([
  'dojo/_base/array'
], function (
  array
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
    }
  };
});