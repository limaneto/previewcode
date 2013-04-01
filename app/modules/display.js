define(function(require, Display) {

  // External libraries.
  var Backbone = require("backbone");
  var _ = require("underscore");

  require("backbone.layoutmanager");

  // Include the syntax highlighting library.
  var Prism = require("vendor/js/prism");

  Display.Model = Backbone.Model.extend({
    urlRoot: "/api/files"
  });

  Display.List = Backbone.View.extend({
    template: "display/list",

    serialize: function() { return this; },

    events: {
      "click li": "showFile"
    },

    showFile: function(ev) {
      var target = this.$(ev.currentTarget).data("idx");
      this.trigger("showFile", target);
    },

    initialize: function() {
      this.listenTo(this.options.files, "change sync", this.render);
    }
  });

  Display.File = Backbone.View.extend({
    template: "display/file",

    serialize: function() {
      if (!this.contents && this.options.files.has("files")) {
        this.contents = this.options.files.get("files")[this.options.idx].contents;
      }

      var contents = this.contents || "";

      return { contents: _.escape(contents) };
    },

    afterRender: function() {
      // If Prism has been loaded, highlight everything.
      if (Prism) { 
        Prism.highlightAll();
      }
    },

    initialize: function() {
      this.listenTo(this.options.files, "change sync", this.render);
    }
  });

});
