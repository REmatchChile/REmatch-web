import React from "react";
import ReactMarkdown from "react-markdown";

const COLORS = {
  primary: "#03DAC6",
  secondary: "#FCE938",
  codeBackground: "#212121",
};

const Markdown = ({ text }) => {
  return (
    <ReactMarkdown
      components={{
        h1: ({ node, ...props }) => (
          <h1 style={{ color: COLORS.primary }} {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 style={{ color: COLORS.primary }} {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 style={{ color: COLORS.primary }} {...props} />
        ),
        strong: ({ node, ...props }) => (
          <strong style={{ color: COLORS.primary }} {...props} />
        ),
        code: ({ node, ...props }) => (
          <code
            style={{
              background: COLORS.codeBackground,
              padding: 2,
              fontFamily: "Roboto Mono",
            }}
            {...props}
          />
        ),
        a: ({ node, ...props }) => (
          <a style={{ color: COLORS.secondary }} {...props} />
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote
            style={{
              background: COLORS.codeBackground,
              padding: "4px 20px",
              borderRadius: 4,
              fontFamily: "Roboto Mono",
            }}
            {...props}
          />
        ),
      }}>
      {text}
    </ReactMarkdown>
  );
};

export default Markdown;
