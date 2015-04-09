/*! jquery-progress.js
 *
 * Authored by: Cory Dorning
 * Website: http://corydorning.com/projects/jquery-progress
 * Source: https://github.com/corydorning/jquery-progress
 *
 * Dependencies: jQuery v1.10+, jQuery UI 1.10+
 *
 * Last modified by: Cory Dorning
 * Last modified on: 09/25/2013
 *
 * The jQuery progress method will poll a given url and update
 * the current progress of an action. Expects the 'url' to return
 * an object with the following properties: finished, value, max
 *
 */

// include semicolon to make sure any JS before this plugin is terminated
;(function($) {
  // ECMAScript 5 strict mode
  "use strict";

  // begin plugin
  $.uiProgress = function(options) {

        // set any defaults
    var defaults = {
          title: 'Progress',
          content: 'Please wait...',
          continuous: false,
          modal: true,
          pollTimer: 3,
          ageTimeout: null,
          url: null
        },

        // overwrite 'defaults' with those passed via 'options'
        settings = $.extend(defaults, options),

        // private methods
        _progress = {
          init: function() {
            // create dialog container
            this.$dialog = $('<div/>');

            // create progressbar
            this.$progressbar = $('<div/>').progressbar();

            // add to DOM
            this.$dialog
              .append(settings.content)
              .append(this.$progressbar)
              .appendTo('body')
              .dialog({ autoOpen: false, modal: settings.modal, title: settings.title });

            // check progress
            this.poll();
          },

          poll: function() {
            var _this = this;

            // make sure url was set
            if (settings.url) {

              _this.pollTimeout = window.setTimeout(function() {
                // get JSON data
                $.getJSON(settings.url, function(data) {

                  // if value or max has changed, update progress bar
                  if (data.value !== _this.value || data.max !== _this.max) {
                    // update value and max
                    _this.value = data.value;
                    _this.max = data.max;

                    // update progress bar
                    _this.update(data);
                  }

                  // check current status
                  if (settings.ageTimeout !== null && data.age > settings.ageTimeout && data.finished) {
                    // progress complete, but request has timed out

                    // reload the page
                    _this.reload();

                  } else if (data.finished && settings.continuous) {
                    // progress complete, continuous polling

                    // close dialog
                    _this.complete();

                    // keep polling
                    _this.poll();

                  } else if (data.finished) {
                    // progress complete, no continuous polling

                    // close dialog
                    _this.complete();

                  } else {
                    // progress not complete, keep polling

                    // open dialog
                    _this.$dialog.dialog('open');

                    // check progress
                    _this.poll();
                  }

                });
              }, settings.pollTimer * 1000);
            }
          },

          reload: function() {
            // cleanup
            clearTimeout(this.pollTimeout);

            // reload page
            window.location.reload();
          },

          update: function(data) {
            // update progress bar
            this.$progressbar.progressbar({
              max: data.max,
              value: data.value
            });
          },

          complete: function() {
            // close dialog
            this.$dialog.dialog('close');
          }

        };

    // start progress
    _progress.init();
  };
})(jQuery);