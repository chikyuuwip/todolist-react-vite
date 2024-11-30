import React from "react";
import { Filter } from "../interface";
import { Box, Typography } from "@mui/material";

interface FiltersProps {
  selectedFilter: Filter;
  onChange: (filter: Filter) => void;
}

const Filters: React.FC<FiltersProps> = ({ selectedFilter, onChange }) => {
  const filters = [Filter.All, Filter.Pending, Filter.Completed];

  return (
    <Box display="flex" gap={2}>
      {filters.map((filter) => (
        <Typography
          key={filter}
          sx={{
            color: selectedFilter === filter ? "red" : "black",
            cursor: "pointer",
          }}
          onClick={() => onChange(filter)}
        >
          {Filter[filter]}
        </Typography>
      ))}
    </Box>
  );
};

export default Filters;
