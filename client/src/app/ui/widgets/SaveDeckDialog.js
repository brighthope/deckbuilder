define([
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/_base/declare',
  'dijit/Dialog',
  'dojo/text!./templates/SaveDeckDialog.html'
], function (TemplatedMixin, WidgetsInTemplateMixin, declare, Dialog, template) {
  return declare([Dialog, TemplatedMixin, WidgetsInTemplateMixin], {
    templateString: template,
    title: 'Save deck',
    style: "width: 400px; height: 300px",

    postMixInProperties: function () {
      this.inherited(arguments);
    },

    buildRendering: function () {
      this.inherited(arguments);
    },

    postCreate: function () {
      this.inherited(arguments);
    },

    startup: function () {
      this.inherited(arguments);
    }
  });
});
