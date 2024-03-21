import React, { useEffect, useMemo, useState } from "react";

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemButton,
  TextField,
  Typography,
} from "@mui/material";
import { createSearchParams, useNavigate } from "react-router-dom";
import Window from "../components/Window";

const EXAMPLES_URL =
  "https://raw.githubusercontent.com/REmatchChile/REmatch-docs/main/examples.json";

const ExamplesList = ({ examples, handleExampleClick }) => {
  const [filterText, setFilterText] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedExample, setSelectedExample] = useState(null);

  const filteredExamples = useMemo(() => {
    const filterTextLowerCase = filterText.toLowerCase();
    return examples.filter(
      (example) =>
        example.title?.toLowerCase().includes(filterTextLowerCase) ||
        example.description?.toLowerCase().includes(filterTextLowerCase)
    );
  }, [examples, filterText]);

  const handleOpenDialog = (example) => {
    setSelectedExample(example);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={() => handleCloseDialog()}
        maxWidth="sm"
        scroll="paper"
        fullWidth
      >
        <DialogTitle
          sx={{
            textAlign: "justify",
          }}
        >
          {selectedExample?.title}
          {selectedExample?.isMultiRegex && (
            <Box component="span" sx={{ color: "secondary.main" }}>
              {" (MultiRegex)"}
            </Box>
          )}
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText sx={{ textAlign: "justify" }}>
            {selectedExample?.description}
          </DialogContentText>
          <Box
            sx={{
              backgroundColor: "grey.900",
              color: "white",
              p: 1,
              my: 2,
              borderRadius: 1,
              fontFamily: "monospace",
              wordBreak: "break-all",
            }}
          >
            {selectedExample?.query}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseDialog()}>Close</Button>
          <Button autoFocus onClick={() => handleExampleClick(selectedExample)}>
            Try it!
          </Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ p: 1.5 }}>
        <TextField
          variant="outlined"
          label="Filter"
          fullWidth
          value={filterText}
          onChange={(event) => setFilterText(event.target.value)}
        />
      </Box>
      <List sx={{ flex: "1 1 auto", overflowY: "auto" }} disablePadding>
        <Divider />
        {!filteredExamples.length ? (
          <ListItem>No results</ListItem>
        ) : (
          filteredExamples.map((example, exampleIdx) => (
            <React.Fragment key={exampleIdx}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleOpenDialog(example)}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    "&:hover .example-title": { textDecoration: "underline" },
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Typography
                      className="example-title"
                      component="div"
                      variant="button"
                      color="primary"
                      sx={{
                        fontWeight: "bolder",
                      }}
                    >
                      {example.title}
                    </Typography>
                    {example.isMultiRegex && (
                      <Chip label="MultiRegex" color="secondary" size="small" />
                    )}
                  </Box>
                  <Typography
                    component="div"
                    variant="body2"
                    color="text.secondary"
                    align="justify"
                  >
                    {example.description}
                  </Typography>
                </ListItemButton>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))
        )}
      </List>
    </>
  );
};

const Examples = () => {
  const navigate = useNavigate();
  const [examples, setExamples] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAndSetExamplesJSON = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(EXAMPLES_URL);
      const text = await res.text();
      if (!res.ok) throw new Error(text);
      setExamples(
        JSON.parse(text)
          .map((example) => ({
            query: example.query || "",
            doc: example.doc.replaceAll("\\n", "\n") || "",
            isMultiRegex: example.isMultiRegex || false,
            title: example.title || "Untitled",
            description: example.description || "No description",
          }))
          .sort((a, b) => a.title.localeCompare(b.title))
      );
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  useEffect(() => {
    fetchAndSetExamplesJSON();
  }, []);

  const handleExampleClick = (example) => {
    const { query, doc, isMultiRegex } = example;
    navigate({
      pathname: "/",
      search: createSearchParams({
        query,
        doc,
        isMultiRegex,
      }).toString(),
    });
  };

  return (
    <Box
      sx={{
        flex: "1 1 auto",
        display: "flex",
        flexDirection: "column",
        p: 1,
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
              onClick={() => fetchAndSetExamplesJSON()}
            >
              Try again
            </Button>
            <Button onClick={() => navigate("/")}>
              Go back to REQL Editor
            </Button>
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
        <Container
          sx={{
            flex: "1 0 0",
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
          }}
        >
          <Window
            headerText={
              <Typography variant="subtitle2" component="div">
                Examples
              </Typography>
            }
          >
            <ExamplesList
              examples={examples}
              handleExampleClick={handleExampleClick}
            />
          </Window>
        </Container>
      )}
    </Box>
  );
};

export default Examples;
