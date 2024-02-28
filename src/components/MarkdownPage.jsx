import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useNavigate } from "react-router-dom";

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
    <Typography
      component="h1"
      variant="h3"
      color="primary"
      gutterBottom
      sx={{ mt: 2, fontSize: 48 }}
    >
      {children}
    </Typography>
  ),
  h2: ({ children }) => (
    <Typography
      component="h2"
      variant="h3"
      color="primary"
      gutterBottom
      sx={{ mt: 2, fontSize: 36 }}
    >
      {children}
    </Typography>
  ),
  h3: ({ children }) => (
    <Typography
      component="h3"
      variant="h3"
      color="primary"
      gutterBottom
      sx={{ mt: 2, fontSize: 32 }}
    >
      {children}
    </Typography>
  ),
  h4: ({ children }) => (
    <Typography
      component="h4"
      variant="h4"
      color="primary"
      gutterBottom
      sx={{ mt: 2, fontSize: 28 }}
    >
      {children}
    </Typography>
  ),
  h5: ({ children }) => (
    <Typography
      component="h5"
      variant="h5"
      color="primary"
      gutterBottom
      sx={{ mt: 2, fontSize: 24 }}
    >
      {children}
    </Typography>
  ),
  h6: ({ children }) => (
    <Typography
      component="h6"
      variant="h6"
      color="primary"
      gutterBottom
      sx={{ mt: 2, fontSize: 20 }}
    >
      {children}
    </Typography>
  ),
  // Table
  table: ({ children, ...props }) => (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
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
        backgroundColor: "#212121",
        py: 0.25,
        px: 0.5,
        borderRadius: 1,
        fontFamily: "'Roboto Mono', monospace",
      }}
    >
      {children}
    </Typography>
  ),
  // Pre (used in code block)
  pre: ({ children }) => (
    <Box
      component="pre"
      sx={{
        backgroundColor: "#212121",
        p: 1,
        my: 3,
        borderRadius: 1,
        fontFamily: "'Roboto Mono', monospace",
        background: "background.paper",
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
