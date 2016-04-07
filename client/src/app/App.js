define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/on',
  'dojo/dom-construct',
  'dijit/_WidgetBase',
  'dijit/layout/BorderContainer',
  'dijit/layout/ContentPane',
  'dijit/form/Button',
  'dstore/RequestMemory',
  'dstore/Memory',
  'dstore/Trackable',
  'dgrid/OnDemandGrid',
  './ui/Header',
  './ui/Body',
  './ui/Search',
  './util/PdfUtil',
  './ui/widgets/SaveDeckDialog'
], function (
  declare,
  lang,
  on,
  domConstruct,
  _WidgetBase,
  BorderContainer,
  ContentPane,
  Button,
  RequestMemory,
  Memory,
  Trackable,
  OnDemandGrid,
  Header,
  Body,
  Search,
  pdfUtil,
  SaveDeckDialog
) {
  return declare ([_WidgetBase], {

    container: null,
    _deckStore: null,
    _cardStore: null,
    _categoryStore: null,
    _typeStore: null,
    _expansionStore: null,
    _layout: null,
    _saveDeckDialog: null,

    postCreate: function () {
      this.inherited(arguments);
      console.debug('App::postCreate');

      var TrackableMemory = declare([Memory, Trackable]);
      this._deckStore = new TrackableMemory({data: [], idProperty: 'id'});

      this._deckStore.on('add, update, delete', function(event){
        var object = event.target;
        var type = event.type;
        console.debug('deck change', object, type);
      });

      this._cardStore = new RequestMemory({
        target: 'app/resources/cdf.json',
        idProperty: 'id'
      });
      this._categoryStore = new RequestMemory({
        target: 'app/resources/card_categories.json',
        idProperty: 'category'
      });
      this._typeStore = new RequestMemory({
        target: 'app/resources/card_types.json',
        idProperty: 'type'
      });
      this._expansionStore = new RequestMemory({
        target: 'app/resources/expansions.json',
        idProperty: 'expansion'
      });


      this._layout = this._createLayout(this.container);
    },

    startup: function () {
      this.inherited(arguments);
      console.debug('App::startup');
      this._layout.container.startup();
    },

    _createLayout: function (container) {
      var bc = new BorderContainer({
        style: "width: 100%; height: 100%; border: 0; padding: 0; margin: 0",
        'class': 'sw-app-container',
        design:'headline'
      }, container);

      /* header */
      var header = new Header();
      on(header, 'deck.export', lang.hitch(this, this._showSaveDialog));
      on(header, 'deck.images', lang.hitch(this, this._createImagePdf));
      var headerPane = new ContentPane({
        region: 'top',
        content: header,
        'class': 'sw-app-header',
        deckStore: this._deckStore
      });
      bc.addChild(headerPane);

      /* search pane */
      var search = new Search({
        cardStore: this._cardStore,
        categoryStore: this._categoryStore,
        typeStore: this._typeStore,
        expansionStore: this._expansionStore
      });
      on(search, 'add.card', lang.hitch(this, this._addCardToDeck));
      on(search, 'show.card', lang.hitch(this, this._showCard));
      var searchPane = new ContentPane({
        region: 'leading',
        splitter:true,
        'class': 'sw-app-search',
        content: search
      });
      bc.addChild(searchPane);

      var body = new Body({
        deckStore: this._deckStore
      });
      var bodyPane = new ContentPane({
        region: "center",
        content: body,
        'class': 'sw-app-body'
      });
      bc.addChild(bodyPane);

      //bc.startup();

      return {
        container: bc,
        header: search,
        search: search,
        body: body
      }
    },

    _addCardToDeck: function (evt) {
      var cardToAdd = evt.card;
      console.debug('_addCardToDeck', cardToAdd);

      var cardInDeck = this._deckStore.getSync(cardToAdd.id);
      console.debug('_addCardToDeck::cardInDeck', cardInDeck);
      if (!cardInDeck) {
        cardToAdd.quantity = 1;
        this._deckStore.add(cardToAdd);
      }
      else {
        cardInDeck.quantity = cardInDeck.quantity + 1;
        this._deckStore.put(cardInDeck);
      }
    },

    _showCard: function (evt) {
      var cardToShow = evt.card;
      console.debug('_showCard', cardToShow);
      this._layout.body.showCard(cardToShow);
    },

    _showSaveDialog: function () {
      if (!this._saveDeckDialog) {
        this._saveDeckDialog = new SaveDeckDialog();
        on(this._saveDeckDialog, 'save', lang.hitch(this, function(evt) {
          console.debug('save', evt);
          this._createDecklistPdf(evt);

        }));
      }
      this._saveDeckDialog.show();
    },

    _createDecklistPdf: function (info) {
      console.debug('App::_createDecklistPdf');
      var pdf = pdfUtil.createDeckList({
        cards: this._deckStore,
        title: info.title,
        player: info.player,
        event: info.event
      });
      pdf.save('deck.pdf');
    },

    _createImagePdf: function () {


      this._getImageFromUrl('/app/resources/cards/starwars/ANewHope-Dark/large/advosze.gif', this.createPDF);

    },

    _getImageFromUrl: function(url, callback) {
      //https://github.com/brandonpayton/image-load
      var img = new Image();

      img.onError = function() {
          alert('Cannot load image: "'+url+'"');
      };
      img.onload = function() {
          callback(img);
      };
      img.src = url;
    },

    createPDF: function (imgData) {
			var doc = new jsPDF();
      doc.addImage(imgData, 'JPEG', 10, 10);
      doc.save('images.pdf')
    }


  });
});