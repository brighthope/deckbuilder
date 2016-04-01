define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dojo/text!./templates/Search.html',
  'dojo/Evented',
  'dojo/dom-construct',
  'dijit/form/FilteringSelect',
  'dijit/form/TextBox',
  'dstore/legacy/DstoreAdapter',
  'dgrid/OnDemandGrid',
  'dgrid/Selection'
], function (
  declare,
  lang,
  array,
  _WidgetBase,
  _TemplatedMixin,
  template,
  Evented,
  domConstruct,
  FilteringSelect,
  TextBox,
  DstoreAdapter,
  OnDemandGrid,
  Selection
) {
  return declare([_WidgetBase, _TemplatedMixin, Evented], {

    templateString: template,
    cardStore: null,
    categoryStore: null,
    typeStore: null,
    expansionStore: null,
    _cardNameFilter: null,
    _cardCategoryFilter: null,
    _cardTypeFilter: null,
    _cardExpansionFilter: null,
    _cardGametextTextbox: null,
    _cardLoreTextbox: null,
    _resultGrid: null,
    _filterobj: null,

    postCreate: function () {
      this.inherited(arguments);
      console.debug('Search::postCreate', this.cardStore);

      this._cardNameFilter = this._createCardFilter(this.cardStore, this.nameFilter);

      //this._cardCategoryFilter = this._createCategoryFilter(this.categoryStore, this.categoryFilter);
      this._cardTypeFilter = this._createTypeFilter(this.typeStore, this.typeFilter);
      this._cardExpansionFilter = this._createExpansionFilter(this.expansionStore, this.expansionFilter);
      this._cardGametextTextbox = this._createGametextTextbox(this.gametextInput);
      this._cardLoreTextbox = this._createLoreTextbox(this.loreInput);

      this._resultGrid = this._createResultGrid(this.cardStore);
      this._filterobj = {};
    },

    startup: function () {
      console.debug('Search::startup');
      this.inherited(arguments);

      this._cardNameFilter.startup();
      //this._cardCategoryFilter.startup();
      this._cardTypeFilter.startup();
      this._cardExpansionFilter.startup();
      this._cardGametextTextbox.startup();
      this._cardLoreTextbox.startup();
      this._resultGrid.startup();
    },

    _createCardFilter: function (store, node) {
      var search = this;
      return new FilteringSelect({
        name: 'cardFilter',
        label:'test',
        store: new DstoreAdapter(store),
        searchAttr: 'name',
        style: 'width:100%',
        placeHolder: 'search a card...',
        onChange: function(value) {
          console.log("filterSelect onchange ", value, this.item);
          //search._showCard(this.item);
          search.emit('show.card', {card: this.item});
        }
      }, node);
    },

    //_createCategoryFilter: function (store, node) {
    //  var search = this;
    //  return new FilteringSelect({
    //    name: 'categoryFilter',
    //    store: new DstoreAdapter(store),
    //    searchAttr: 'label',
    //    style: 'width:100%',
    //    placeHolder: 'select a category',
    //    onChange: function(value){
    //      console.log("filterSelect onchange ", value, this.item);
    //      search._filterGrid('category', this.item.label);
    //    }
    //  }, node);
    //},

    _createTypeFilter: function (store, node) {
      var search = this;
      return new FilteringSelect({
        name: 'typeFilter',
        store: new DstoreAdapter(store),
        searchAttr: 'label',
        style: 'width:100%',
        placeHolder: 'select a card type',
        onChange: function(value){
          console.log("filterSelect onchange ", value, this.item);
          search._filterGrid('type', this.item.label);
        }
      }, node);
    },

    _createExpansionFilter: function (store, node) {
      var search = this;
      return new FilteringSelect({
        name: 'expansionFilter',
        store: new DstoreAdapter(store),
        searchAttr: 'label',
        style: 'width:100%',
        placeHolder: 'select an expansion',
        onChange: function(value) {
          console.log("filterSelect onchange ", value, this.item);
          search._filterGrid('expansion', this.item.label);
        }
      }, node);
    },

    _createGametextTextbox: function (node) {
      var search = this;
      return new TextBox({
        type: 'text',
        style: 'width:100%',
        placeHolder: 'search in game text',
        intermediateChanges: true,
        onChange: function(value) {
          console.log("gametext TextBox onchange", value);
          search._filterGrid('gametext', value);
        }
      }, node);
    },

    _createLoreTextbox: function (node) {
      var search = this;
      return new TextBox({
        type: 'text',
        style: 'width:100%',
        placeHolder: 'search in lore',
        intermediateChanges: true,
        onChange: function(value) {
          console.log("lore TextBox onchange", value);
          search._filterGrid('lore', value);
        }
      }, node);
    },

    _createResultGrid: function (collection) {
      var grid = new (declare([ OnDemandGrid, Selection ]))({
        selectionMode: 'single',
        collection: collection,
        'class': 'card-grid',
        columns: {
          side: {
            label: 'Side',
            formatter: function (value) {
              return value === 'light' ? '<i class="fa fa-rebel"></i>' : '<i class="fa fa-empire"></i>'
            }
          },
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
                  this._addCard(row.data);
                })
              }, div);
              return div;
            })
          }
        }
      }, this.resultGridNode);

      grid.on('.dgrid-content .dgrid-row:dblclick', lang.hitch(this, function (event) {
        var row = grid.row(event);
        console.debug('result grid row dbl click', row);
        this._addCard(row.data);
      }));

      grid.on('dgrid-select', lang.hitch(this, function (event) {
        var rows = event.rows;
        //this._showCard(rows[0].data);
        this.emit('show.card', {card: rows[0].data});
      }));

      return grid;
    },

    _addNameCard: function (evt) {
      evt.preventDefault();
      var cardId = this._cardNameFilter.get('value');
      if (!cardId) {
        return
      }

      console.debug('_addNameCard', cardId, this.cardStore);
      var card = this.cardStore.get(cardId).then(
        lang.hitch(this, function (card) {
          this._addCard(card);
        }),
        function (error) {
          console.error(error);
        }
      );
      console.debug('_addNameCard', card);
    },

    _addCard: function (card) {
      console.debug('Search::addCard', card);
      this.emit('add.card', {card: card});
    },

    _filterGrid: function (type, value) {
      console.debug('filter grid');
      var filter = new this.cardStore.Filter();
      var filterArray = [];

      if (type && value) {
        this._filterobj[type] = value;
      }
      else if (type) {
        delete this._filterobj[type];
      }

      if (type==='gametext') {
        filterArray.push(filter.match('text', new RegExp(value + "+", "i")));
      }
      else if (type==='lore') {
        filterArray.push(filter.match('lore', new RegExp(value + "+", "i")));
      }
      else {
        for (var property in this._filterobj) {
          if (this._filterobj.hasOwnProperty(property)) {
            filterArray.push(filter.eq(property, this._filterobj[property]));
          }
        }
      }

      array.forEach(filterArray, function (filterItem) {
        filter = filter.and(filterItem);
      });

      console.debug('filter: ', filter);
      var filteredCollection = this.cardStore.filter(filter);
      this._resultGrid.set('collection', filteredCollection);
    },

    _sideInputChanged: function (evt) {
      console.debug('Search::_sideInputChanged: ', evt.target.value);
      this._filterGrid('side', evt.target.value);
    }


  });
});