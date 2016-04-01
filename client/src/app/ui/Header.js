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

    postCreate: function () {
      this.inherited(arguments);
      console.debug('Header::postCreate');
    },

    startup: function () {
      console.debug('Header::startup');
      this.inherited(arguments);
    }

  });
});