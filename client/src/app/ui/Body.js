define([
  'dojo/_base/declare',
  'dojo/text!./templates/Body.html',
  'dojo/_base/lang',
  'dojo/on',
  'dojo/dom-construct',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/layout/BorderContainer',
  'dijit/layout/ContentPane',
  'dijit/form/Button',
  'dstore/RequestMemory',
  'dstore/Memory',
  'dstore/Trackable',
  'dgrid/OnDemandGrid',
  'dgrid/Selection',
  'dgrid/extensions/DijitRegistry'
], function (
  declare,
  template,
  lang,
  on,
  domConstruct,
  _WidgetBase,
  _TemplatedMixin,
  BorderContainer,
  ContentPane,
  Button,
  RequestMemory,
  Memory,
  Trackable,
  OnDemandGrid,
  Selection,
  DijitRegistry
) {
  return declare([_WidgetBase, _TemplatedMixin], {

    templateString: template,
    deckStore: null,
    baseClass: 'body-content',
    _grid: null,

    postCreate: function () {
      this.inherited(arguments);
      console.debug('Body::postCreate', this.deckStore);
      this._grid = this._createDeckGrid(this.deckStore, this.deckGridNode);

      //var btn = new Button({
      //  label: 'test',
      //  onClick: lang.hitch(this, this._test)
      //}, this.testButtonNode);


    },

    startup: function () {
      console.debug('Body::startup');
      this.inherited(arguments);
    },

    addCard: function (card) {

    },

    refresh: function () {
      console.debug('Body::refresh');
      this.inherited(arguments)
    },
    resize: function () {
      console.debug('Body::resize');
      this._grid.resize();
      this.inherited(arguments)
    },

    _createDeckGrid: function (store, node) {

      var grid = new (declare([OnDemandGrid, Selection, DijitRegistry]))({
      //var grid = new OnDemandGrid({
        collection: store,
        'class': 'card-grid',
        noDataMessage: 'No cards were added tot the deck',
        columns: {
          quantity: '#',
          name: 'Title',
          expansion: 'Set',
          type: 'Card type',
          add: {
            label: '',
            className: 'edit-column',
            renderCell: lang.hitch(this, function (object) {
              var div = domConstruct.create('div', {'class': 'dGridAdd'});
              domConstruct.create('a', {
                href: '#',
                title: 'Add card',
                className: 'fa fa-plus',
                innerHTML: '',
                onclick: lang.hitch(this, function (evt) {
                  evt.preventDefault();
                  var row = grid.row(evt);
                  this._updateCardPlus(row.data);
                })
              }, div);
              return div;
            })
          },
          remove: {
            label: '',
            className: 'edit-column',
            renderCell: lang.hitch(this, function (object) {
              var div = domConstruct.create('div', {'class': 'dGridAdd'});
              domConstruct.create('a', {
                href: '#',
                title: 'Remove card',
                className: 'fa fa-minus',
                innerHTML: '',
                onclick: lang.hitch(this, function (evt) {
                  evt.preventDefault();
                  var row = grid.row(evt);
                  this._updateCardMin(row.data);
                })
              }, div);
              return div;
            })
          }
        }
      }, node);

      grid.on('dgrid-select', lang.hitch(this, function (event) {
        var rows = event.rows;
        this.showCard(rows[0].data);
      }));

      return grid;
    },

    _updateCardPlus: function (card) {
      card.quantity = card.quantity + 1;
      this.deckStore.put(card);
    },

    _updateCardMin: function (card) {
      if (card.quantity > 1) {
        card.quantity = card.quantity - 1;
        this.deckStore.put(card);
      }
      else {
        this.deckStore.remove(card.id);
      }
    },


    showCard: function (card) {
      console.debug('_showCard', card);
      domConstruct.empty(this.imageNode);
      domConstruct.empty(this.imageBackNode);

      domConstruct.create('img', {
        src: 'app/resources/cards' + card.image_path + card.image,
        alt: card.image
      }, this.imageNode);

      if (card.two_sided) {
        domConstruct.create('img', {
          src: 'app/resources/cards' + card.image_path + card.image_back,
          alt: image_back
        }, this.imageBackNode);
      }
    },

    _test: function () {
      console.debug('test');
      this.deckStore.fetchSync().forEach(function(card) {
        console.debug('deck data', card);
      });
    }

  });
});