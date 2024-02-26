import { StateField, StateEffect } from "@codemirror/state";
import { EditorView, Decoration } from "@codemirror/view";

const addMark = StateEffect.define({
  map: ({ from, to, cls }, change) => ({
    from: change.mapPos(from),
    to: change.mapPos(to),
    cls,
  }),
});

const removeAll = StateEffect.define({});

export const MarkExtension = StateField.define({
  create() {
    return Decoration.none;
  },
  update(decorations, transaction) {
    // Clear the marks when the document changes
    if (transaction.docChanged) return Decoration.none;
    // Update the marks
    decorations = decorations.map(transaction.changes);
    for (const effect of transaction.effects) {
      if (effect.is(removeAll)) {
        decorations = Decoration.none;
      } else if (effect.is(addMark)) {
        decorations = decorations.update({
          add: [
            Decoration.mark({ class: effect.value.cls }).range(
              effect.value.from,
              effect.value.to
            ),
          ],
        });
      }
    }
    return decorations;
  },
  provide: (f) => EditorView.decorations.from(f),
});

export const addMarks = (view, spans) => {
  // Clear all the marks before adding new ones
  const effects = [
    removeAll.of(null),
    ...spans.map((span, idx) =>
      addMark.of({
        from: span[0],
        to: span[1],
        cls: `cm-match cm-match-${idx}`,
      })
    ),
  ];
  view.dispatch({ effects });
  return true;
};

export const removeMarks = (view) => {
  const effects = [removeAll.of(null)];
  view.dispatch({ effects });
  return true;
};
