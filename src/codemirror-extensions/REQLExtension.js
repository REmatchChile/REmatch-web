import { simpleMode } from "@codemirror/legacy-modes/mode/simple-mode";
import {
  StreamLanguage,
  syntaxHighlighting,
  HighlightStyle,
  LanguageSupport,
} from "@codemirror/language";
import { Tag } from "@lezer/highlight";

const REQLSimpleMode = simpleMode({
  start: [
    {
      regex: /(![A-Za-z0-9]+\{|\})/,
      token: "var",
    },
    {
      regex:
        /(\\d)|(\\w)|(\\s)|(\\t)|(\\r)|(\\n)|(\\\()|(\\\))|(\\\[)|(\\\])|(\\\{)|(\\\})|(\\\.)|(\\-)|(\\_)/i,
      token: "escape",
    },
    {
      regex: /(\(|\)|\||\[(\^)?|\]|-)/,
      token: "braces",
    },
    {
      regex: /(\+|\*|\.|\+|\?)/,
      token: "operator",
    },
    {
      regex: /\{(\d+|\d+,\d+|\d+,|,\d+)\}/,
      token: "numericQuantifier",
    },
    {
      regex: /(\$|\^)/,
      token: "anchor",
    },
  ],
});

REQLSimpleMode.tokenTable = {
  var: Tag.define(),
  escape: Tag.define(),
  braces: Tag.define(),
  operator: Tag.define(),
  numericQuantifier: Tag.define(),
  anchor: Tag.define(),
};

const REQLStreamLanguage = StreamLanguage.define(REQLSimpleMode);

const REQLSyntaxHighlighting = syntaxHighlighting(
  HighlightStyle.define([
    {
      tag: REQLSimpleMode.tokenTable.var,
      class: "reql-variable",
    },
    {
      tag: REQLSimpleMode.tokenTable.escape,
      class: "reql-escape",
    },
    {
      tag: REQLSimpleMode.tokenTable.braces,
      class: "reql-braces",
    },
    {
      tag: REQLSimpleMode.tokenTable.operator,
      class: "reql-operator",
    },
    {
      tag: REQLSimpleMode.tokenTable.numericQuantifier,
      class: "reql-numeric-quantifier",
    },
    {
      tag: REQLSimpleMode.tokenTable.anchor,
      class: "reql-anchor",
    },
  ])
);

export const REQLExtension = new LanguageSupport(REQLStreamLanguage, [
  REQLSyntaxHighlighting,
]);
