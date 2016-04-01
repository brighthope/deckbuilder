/*jshint unused:false*/
var dojoConfig = {
  async: true,
  parseOnLoad: false,
  tlmSiblingOfDojo: false,
  isDebug: true,
  locale: 'nl-be',
  baseUrl: '.',
  packages: [
    'dojo',
    'dstore',
    'dijit',
    'dgrid',
    'app',
    {
        location: './davewilton-dbootstrap',
        name: 'dbootstrap'
    }
  ]
};