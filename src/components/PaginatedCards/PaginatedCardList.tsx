import {
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid"; // 👈 must be this
import React, { useMemo, useState } from "react";
import { Item } from "../../assets/items";

interface Props {
  items: Item[];
  itemsPerPage?: number;
}

const PaginatedCardList: React.FC<Props> = ({ items, itemsPerPage = 4 }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);

  const intentOptions = useMemo(() => {
    const intents = Array.from(new Set(items.map((item) => item.intent)));
    return ["All", ...intents];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) &&
        (category === "All" || item.intent === category)
    );
  }, [items, search, category]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const displayedItems = filteredItems.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Box p={3}>
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField
          label="Search"
          placeholder="Search by title"
          variant="outlined"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Intent</InputLabel>
          <Select
            value={category}
            label="Intent"
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
          >
            {intentOptions.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {displayedItems.length === 0 ? (
        <Typography variant="body1" mt={2}>
          No results found.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {displayedItems.map((item) => (
            <Grid container spacing={2} component="div">
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {item.content}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Intent:</strong> {item.intent}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Means:</strong> {item.means}
                  </Typography>
                  <Typography variant="body2">
                    <strong>XXX:</strong> {item.xxx}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box mt={3} display="flex" justifyContent="center">
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default PaginatedCardList;
