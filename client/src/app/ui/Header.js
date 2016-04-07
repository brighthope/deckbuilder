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
    baseClass: 'header',

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
      this.emit('deck.export');
    },

    _exportImages: function () {
      console.debug('Header::_exportImages');
      this.emit('deck.images');
    }

  });
});