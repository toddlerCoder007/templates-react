import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  Box,
  Card,
  CardContent,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Item } from "../../assets/items";

interface Props {
  items: Item[];
}

const PaginatedCardList: React.FC<Props> = ({ items }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(0);

  const cardsPerPage = 9; // 3 columns x 3 rows

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

  const totalPages = Math.ceil(filteredItems.length / cardsPerPage);

  const scrollToPage = (page: number) => {
    const container = scrollRef.current;
    if (container) {
      const pageWidth = container.clientWidth;
      container.scrollTo({
        left: page * pageWidth,
        behavior: "smooth",
      });
    }
  };

  const handleNextPage = () => {
    const nextPage = currentPage >= totalPages - 1 ? 0 : currentPage + 1;
    scrollToPage(nextPage);
  };

  const handlePrevPage = () => {
    const prevPage = currentPage <= 0 ? totalPages - 1 : currentPage - 1;
    scrollToPage(prevPage);
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let pageWidth = container.clientWidth;

    const resizeObserver = new ResizeObserver(() => {
      pageWidth = container.clientWidth;
    });
    resizeObserver.observe(container);

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const page = Math.round(scrollLeft / pageWidth);
      setCurrentPage(page);
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <Box p={3}>
      {/* Filters */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField
          label="Search"
          placeholder="Search by title"
          variant="outlined"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(0);
            scrollToPage(0);
          }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Intent</InputLabel>
          <Select
            value={category}
            label="Intent"
            onChange={(e) => {
              setCategory(e.target.value);
              setCurrentPage(0);
              scrollToPage(0);
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

      {/* Cards + Arrows */}
      {filteredItems.length === 0 ? (
        <Typography variant="body1" mt={2}>
          No results found.
        </Typography>
      ) : (
        <Box position="relative">
          {/* Left Arrow */}
          <IconButton
            onClick={handlePrevPage}
            sx={{
              position: "absolute",
              top: "45%",
              left: 0,
              zIndex: 2,
              backgroundColor: "white",
              boxShadow: 1,
              "&:hover": { backgroundColor: "grey.100" },
            }}
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>

          {/* Scrollable Card Pages */}
          <Box
            ref={scrollRef}
            sx={{
              display: "flex",
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              scrollBehavior: "smooth",
              width: "100%",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {Array.from({ length: totalPages }).map((_, pageIdx) => {
              const pageItems = filteredItems.slice(
                pageIdx * cardsPerPage,
                (pageIdx + 1) * cardsPerPage
              );

              return (
                <Box
                  key={pageIdx}
                  sx={{
                    flex: "0 0 100%",
                    maxWidth: "100%",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    justifyContent: "center",
                    scrollSnapAlign: "start",
                    p: 1,
                    boxSizing: "border-box",
                  }}
                >
                  {pageItems.map((item) => (
                    <Card
                      key={item.id}
                      variant="outlined"
                      sx={{
                        width: "30%",
                        minWidth: 250,
                        flex: "0 0 30%",
                        boxSizing: "border-box",
                      }}
                    >
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
                  ))}
                </Box>
              );
            })}
          </Box>

          {/* Right Arrow */}
          <IconButton
            onClick={handleNextPage}
            sx={{
              position: "absolute",
              top: "45%",
              right: 0,
              zIndex: 2,
              backgroundColor: "white",
              boxShadow: 1,
              "&:hover": { backgroundColor: "grey.100" },
            }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* Dot Pagination */}
      {filteredItems.length > 0 && (
        <Box mt={2} display="flex" justifyContent="center">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <Box
              key={idx}
              onClick={() => scrollToPage(idx)}
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: currentPage === idx ? "primary.main" : "grey.400",
                mx: 0.5,
                cursor: "pointer",
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default PaginatedCardList;
