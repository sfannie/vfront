/*
  公共C模块
 */
 define([
  'zepto',
  'js/common/utils',
  'js/common/ui'
  ], function(
    $,
    Utils,
    UI
  ){

    var C = window.C = {
      Utils: Utils,
      UI: UI
    };

 });