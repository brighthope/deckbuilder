define([
  'dojo/_base/declare',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dojo/text!./templates/Header.html'
], function (
  declare,
  _WidgetBase,
  _TemplatedMixin,
  template
) {
  return declare([_WidgetBase, _TemplatedMixin], {

    templateString: template,
    deckStore: null,

    postCreate: function () {
      this.inherited(arguments);
      console.debug('Header::postCreate', this.deckStore);
    },

    startup: function () {
      console.debug('Header::startup');
      this.inherited(arguments);
    },

    _exportDeckList: function () {
      console.debug('Header::_exportDeckList');
      var doc = new jsPDF();
      doc.text(20, 20, this.deckStore.fetchSync());

      //this.deckStore.fetchSync().forEach(function(card) {
      //  console.debug('deck data', card);
      //});

      doc.save('Test2.pdf');
    }

  });
});