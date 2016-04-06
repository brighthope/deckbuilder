define([
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/_base/declare',
  'dijit/Dialog',
  'dojo/text!./templates/SaveDeckDialog.html',
  'dijit/form/Button',
  'dijit/form/TextBox'
], function (TemplatedMixin, WidgetsInTemplateMixin, declare, Dialog, template) {
  return declare([Dialog, TemplatedMixin, WidgetsInTemplateMixin], {
    templateString: template,
    title: 'Save deck',
    baseClass: 'save-deck-dialog',

    postCreate: function () {
      this.inherited(arguments);
    },

    startup: function () {
      this.inherited(arguments);
    },

    _save: function () {
      console.debug('save dialog');
      this.emit('save', {
        title: this.deckTitle.get('value'),
        event: this.eventName.get('value'),
        player: this.playerName.get('value')
      });
      this.hide();
      this._reset();
    },

    _cancel: function () {
      console.debug('cancel dialog');
      this.hide();
      this._reset();
    },

    _reset: function () {
      this.deckTitle.set('value', null);
      this.eventName.set('value', null);
      this.playerName.set('value', null);
    }
  });
});
