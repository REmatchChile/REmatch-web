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
    for (const effect of transaction.effects) {
      if (effect.is(setSpans)) {
        const marks = [];
        effect.value.forEach((spans, idxSpans) => {
          spans.forEach(([from, to]) => {
            marks.push(
              Decoration.mark({
                class: `cm-match cm-match-${idxSpans}`,
              }).range(
                utf8IndexToJavascriptIndex(docString, from),
                utf8IndexToJavascriptIndex(docString, to)
              )
            );
          });
        });
        decorations = Decoration.set(marks, true);
      }
    }
    return decorations;
  },
  provide: (f) => EditorView.decorations.from(f),
});

export const addMarks = (view, spans) => {
  // Clear all the marks before adding new ones
  view.dispatch({ effects: setSpans.of([]) });
  view.dispatch({
    effects: [
      setSpans.of(spans),
      EditorView.scrollIntoView(spans[0][0], { y: "center" }),
    ],
  });
};

export const clearMarks = (view) => {
  view.dispatch({ effects: setSpans.of([]) });
}