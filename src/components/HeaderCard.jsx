import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  IconButton,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";

import { Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFilter } from "./context/useFilter";
import { genres } from "../Utils/constant";

const HeaderCard = () => {
  const [searchInput, setSearchInput] = useState("");

  const { filters, setFilters } = useFilter();
  const navigate = useNavigate();

  useEffect(() => {
    const debounce = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
    }, 500);

    return () => {
      clearTimeout(debounce);
    };
  }, [searchInput, setFilters]);

  return (
    <Card
      sx={{
        maxWidth: 1200,
        margin: { xs: 2, sm: 3, md: 4, lg: "20px auto" },
        padding: 2,
        borderRadius: 3,
        boxShadow: 3,
      }}
    >
      <CardContent>
        <Box
          display="flex"
          flexWrap="wrap"
          alignItems="center"
          gap={2}
          justifyContent="space-between"
        >
          <Box position="relative" flex="1 1 300px" minWidth="250px">
            <TextField
              label="Search book"
              variant="outlined"
              size="small"
              fullWidth
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <IconButton
              color="primary"
              sx={{
                position: "absolute",
                right: 0,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              <Search />
            </IconButton>
          </Box>

          <Box display="flex" flexWrap="wrap" gap={2}>
            <FormControl size="small" sx={{ minWidth: 150, flex: "1 1 120px" }}>
              <InputLabel>Genre</InputLabel>
              <Select
                value={filters.genre}
                label="Genre"
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, genre: e.target.value }))
                }
              >
                <MenuItem value="">All</MenuItem>
                {genres.map((genre) => (
                  <MenuItem key={genre} value={genre}>
                    {genre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150, flex: "1 1 120px" }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="issued">Issued</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box flex="0 0 auto">
            <Button
              variant="contained"
              color="primary"
              startIcon={<Plus />}
              onClick={() => navigate(`/book`)}
            >
              Add New
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default HeaderCard;
