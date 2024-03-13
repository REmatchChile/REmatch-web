import { StateField, StateEffect } from "@codemirror/state";
import { EditorView, Decoration } from "@codemirror/view";
import { utf8IndexToJavascriptIndex } from "../utils/utf8IndexToJavascriptIndex";


const setSpans = StateEffect.define();

export const MarkExtension = StateField.define({
  create() {
    return Decoration.none;
  },
  update(decorations, transaction) {
    const docString = transaction.newDoc.toString();
    // Clear the marks when the document changes
    if (transaction.docChanged) return Decoration.none;
    // Update the marks
    decorations = decorations.map(transaction.changes);
    for (const effect of transaction.effects) {
      if (effect.is(setSpans)) {
        decorations = Decoration.set(
          effect.value.map(([from, to], idxSpan) =>
            Decoration.mark({
              class: `cm-match cm-match-${idxSpan}`,
            }).range(
              utf8IndexToJavascriptIndex(docString, from),
              utf8IndexToJavascriptIndex(docString, to)
            )
          )
        );
      }
    }
    return decorations;
  },
  provide: (f) => EditorView.decorations.from(f),
});

export const addMarks = (view, spans) => {
  // Clear all the marks before adding new ones
  const effects = [
    setSpans.of(spans),
    EditorView.scrollIntoView(spans[0][0], { y: "center" }),
  ];
  view.dispatch({ effects });
  return true;
};
