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
        <Link component="a" href={href} underline="hover" color="primary" rel="noreferrer">
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
            variant="h1"
            gutterBottom
            sx={{ mt: 3, fontWeight: 500, fontSize: "2.5rem !important" }}
        >
            {children}
        </Typography>
    ),
    h2: ({ children }) => (
        <Typography
            component="h2"
            variant="h2"
            gutterBottom
            sx={{ mt: 3, fontWeight: 500, fontSize: "2rem !important" }}
        >
            {children}
        </Typography>
    ),
    h3: ({ children }) => (
        <Typography
            component="h3"
            variant="h3"
            gutterBottom
            sx={{ mt: 3, fontWeight: 500, fontSize: "1.5rem !important" }}
        >
            {children}
        </Typography>
    ),
    h4: ({ children }) => (
        <Typography
            component="h4"
            variant="h4"
            gutterBottom
            sx={{ mt: 3, fontWeight: 500, fontSize: "1.17rem !important" }}
        >
            {children}
        </Typography>
    ),
    h5: ({ children }) => (
        <Typography
            component="h5"
            variant="h4"
            gutterBottom
            sx={{ mt: 3, fontWeight: 500, fontSize: "1rem !important" }}
        >
            {children}
        </Typography>
    ),
    h6: ({ children }) => (
        <Typography
            component="h6"
            variant="h6"
            gutterBottom
            sx={{ mt: 3, fontWeight: 500, fontSize: ".83rem !important" }}
        >
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
        <Box component="ol" sx={{ pl: "2rem", mt: 2 }}>
            {children}
        </Box>
    ),
    ul: ({ children }) => (
        <Box component="ul" sx={{ pl: "2rem", mt: 2 }}>
            {children}
        </Box>
    ),
    li: ({ children }) => (
        <Box component="li" sx={{ mt: 0.5, "&::marker": { color: "primary.main" } }}>
            {children}
        </Box>
    ),
    // Code
    code: ({ children }) => (
        <Typography
            component="code"
            sx={{
                backgroundColor: "grey.900",
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
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const fetchAndSetMarkdownText = async () => {
        setError(false);
        setLoading(true);
        try {
            const res = await fetch(url);
            const text = await res.text();
            if (!res.ok) throw new Error(text);
            setMarkdownText(text);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError(true);
        }
    };

    useEffect(() => {
        fetchAndSetMarkdownText();
        // eslint-disable-next-line
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
                        <Button variant="outlined" onClick={() => fetchAndSetMarkdownText()}>
                            Try again
                        </Button>
                        <Button onClick={() => navigate("/")}>Go back to REQL Editor</Button>
                    </Box>
                </Box>
            ) : loading ? (
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
