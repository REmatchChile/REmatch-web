import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  CircularProgress,
  Container,
  Link,
  List,
  ListItem,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Markdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import remarkGfm from "remark-gfm";

// src: https://stackoverflow.com/questions/62923448/using-react-markdown-with-material-ui-table
const components = {
  // Links
  a: ({ href, children }) => (
    <Link
      component="a"
      href={href}
      underline="hover"
      color="secondary"
      rel="noreferrer"
    >
      {children}
    </Link>
  ),
  // Text
  p: ({ children }) => (
    <Typography component="p" textAlign="justify" sx={{ mt: 1 }}>
      {children}
    </Typography>
  ),
  del: ({ children }) => (
    <Typography component="del" sx={{ mt: 1, textDecoration: "line-through" }}>
      {children}
    </Typography>
  ),
  em: ({ children }) => (
    <Typography component="em" sx={{ mt: 1, fontStyle: "italic" }}>
      {children}
    </Typography>
  ),
  strong: ({ children }) => (
    <Typography component="strong" sx={{ mt: 1, fontWeight: "bold" }}>
      {children}
    </Typography>
  ),
  b: ({ children }) => (
    <Typography component="b" sx={{ mt: 1, fontWeight: "bold" }}>
      {children}
    </Typography>
  ),
  h1: ({ children }) => (
    <Typography component="h1" variant="h1" gutterBottom sx={{ mt: 3 }}>
      {children}
    </Typography>
  ),
  h2: ({ children }) => (
    <Typography component="h2" variant="h2" gutterBottom sx={{ mt: 3 }}>
      {children}
    </Typography>
  ),
  h3: ({ children }) => (
    <Typography component="h3" variant="h3" gutterBottom sx={{ mt: 3 }}>
      {children}
    </Typography>
  ),
  h4: ({ children }) => (
    <Typography component="h4" variant="h4" gutterBottom sx={{ mt: 3 }}>
      {children}
    </Typography>
  ),
  h5: ({ children }) => (
    <Typography component="h5" variant="h4" gutterBottom sx={{ mt: 3 }}>
      {children}
    </Typography>
  ),
  h6: ({ children }) => (
    <Typography component="h6" variant="h6" gutterBottom sx={{ mt: 3 }}>
      {children}
    </Typography>
  ),
  // Table
  table: ({ children, ...props }) => (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table size="small">{children}</Table>
    </TableContainer>
  ),
  tbody: ({ children }) => <TableBody component="tbody">{children}</TableBody>,
  thead: ({ children }) => <TableHead component="thead">{children}</TableHead>,
  tr: ({ children }) => <TableRow component="tr">{children}</TableRow>,
  th: ({ children }) => <TableCell component="th">{children}</TableCell>,
  td: ({ children }) => <TableCell component="td">{children}</TableCell>,
  // Lists
  ol: ({ children }) => (
    <List
      component="ol"
      sx={{
        listStyleType: "decimal",
        mt: 1,
        pl: 1,
        "& .MuiListItem-root": {
          display: "list-item",
        },
      }}
    >
      {children}
    </List>
  ),
  ul: ({ children }) => (
    <List
      component="ul"
      sx={{
        listStyleType: "disc",
        mt: 1,
        pl: 1,
        "& .MuiListItem-root": {
          display: "list-item",
        },
      }}
    >
      {children}
    </List>
  ),
  li: ({ children }) => (
    <ListItem component="li" sx={{ m: 0, p: 0, ml: 1 }} disableGutters>
      <ListItemText sx={{ pl: 0.25 }}>{children}</ListItemText>
    </ListItem>
  ),
  // Code
  code: ({ children }) => (
    <Typography
      component="code"
      sx={{
        backgroundColor: "grey.800",
        color: "white",
        py: 0.25,
        px: 0.5,
        borderRadius: 1,
        fontFamily: "monospace",
      }}
    >
      {children}
    </Typography>
  ),
  // Blockquotes
  blockquote: ({ children }) => (
    <Box
      component="blockquote"
      sx={{
        my: 2,
        p: 1,
        borderLeft: "2px solid",
        borderColor: "primary.main",
        fontStyle: "italic",
        "& p": {
          m: 0,
        },
      }}
    >
      {children}
    </Box>
  ),
  // Pre (used in code block)
  pre: ({ children }) => (
    <Box
      component="pre"
      sx={{
        display: "flex",
        overflowX: "auto",
        borderRadius: 1,
        my: 2,
        "& code": {
          flex: "1 1 auto",
          p: 2,
        },
      }}
    >
      {children}
    </Box>
  ),
};

const MarkdownPage = ({ url }) => {
  const [markdownText, setMarkdownText] = useState("");
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const fetchAndSetMarkdownText = async () => {
    setError(false);
    try {
      const res = await fetch(url);
      const text = await res.text();
      if (!res.ok) throw new Error(text);
      setMarkdownText(text);
    } catch (error) {
      setError(true);
    }
  };

  useEffect(() => {
    fetchAndSetMarkdownText();
  }, [url]);

  return (
    <Box
      sx={{
        overflowY: "auto",
        overflowX: "hidden",
        flex: "1 1 auto",
        display: "flex",
        flexDirection: "column",
        py: 3,
      }}
    >
      {error ? (
        <Box
          sx={{
            flex: "1 1 auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" color="error" gutterBottom align="center">
            Sorry, something went wrong 😿
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              justifyContent: "space-between ",
            }}
          >
            <Button
              variant="outlined"
              onClick={() => fetchAndSetMarkdownText()}
            >
              Try again
            </Button>
            <Button onClick={() => navigate("/")}>
              Go back to REQL Editor
            </Button>
          </Box>
        </Box>
      ) : !markdownText ? (
        <Box
          sx={{
            flex: "1 1 auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress color="primary" size="4rem" />
        </Box>
      ) : (
        <Container component="main" maxWidth="md">
          <Markdown remarkPlugins={[remarkGfm]} components={components}>
            {markdownText}
          </Markdown>
        </Container>
      )}
    </Box>
  );
};

export default MarkdownPage;
