import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
} from "@mui/material";
import { Edit2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import DeleteModal from "./modal/DeleteModal";
import { notifyError, notifySuccess } from "../Utils/toast";
import { deleteBook, fetchBooks } from "../services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Spinner from "./Spinner";
import NotFound from "./NotFound";
import { useFilter } from "./context/useFilter";

const DataTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const { filters } = useFilter();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["books"],
    queryFn: fetchBooks,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries(["books"]);
      notifySuccess("Book deleted successfully!");
    },
    onError: () => {
      notifyError("Can't delete right now!");
    },
  });

  const handleDeleteClick = (id) => {
    setDeleteIndex(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    if (deleteIndex) {
      deleteMutation.mutate(deleteIndex);
    }
    setOpenDialog(false);
    // notifySuccess(`Deleted successfully!`);
  };

  const handleChangePage = (e, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };


  const filteredData = useMemo(() => {
    return data?.filter((row) => {
      const matchesSearch =
        filters.search === "" ||
        row?.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        row?.author.toLowerCase().includes(filters.search.toLowerCase());

      const matchesGenre =
        filters.genre === "" ||
        row?.genre.toLowerCase() === filters.genre.toLowerCase();

      const matchesStatus =
        filters.status === "" ||
        row?.status.toLowerCase() === filters.status.toLowerCase();

      return matchesSearch && matchesGenre && matchesStatus;
    });
  }, [filters, data]);

  const paginatedData = filteredData?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  useEffect(() => {
    setPage(0);
  }, [filters, rowsPerPage]);

  return isLoading ? (
    <Spinner />
  ) : isError ? (
    <NotFound title={"Error while fetching data!"} />
  ) : paginatedData?.length > 0 ? (
    <Paper
      sx={{
        maxWidth: 1200,
        margin: { xs: 2, sm: 3, md: 4, lg: "20px auto" },
        padding: 2,
        borderRadius: 3,
        boxShadow: 3,
      }}
    >
      <TableContainer sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow className="bg-gray-200">
              <TableCell className="font-bold text-gray-700">S.No.</TableCell>
              <TableCell className="font-bold text-gray-700">Title</TableCell>
              <TableCell className="font-bold text-gray-700">Author</TableCell>
              <TableCell className="font-bold text-gray-700">Genre</TableCell>
              <TableCell className="font-bold text-gray-700">
                Published Year
              </TableCell>
              <TableCell className="font-bold text-gray-700">Status</TableCell>
              <TableCell align="center" className="font-bold text-gray-700">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData?.map((row, index) => (
              <TableRow key={row?._id}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>{row?.title}</TableCell>
                <TableCell>{row?.author}</TableCell>
                <TableCell>{row?.genre}</TableCell>
                <TableCell>{row?.year}</TableCell>
                <TableCell>{row?.status}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/book/${row?._id}`)}
                  >
                    <Edit2 />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(row?._id)}
                  >
                    <Trash2 />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        className="bg-gray-200"
      >
        <TablePagination
          component="div"
          count={filteredData?.length || 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[]}
        />
      </Box>

      {deleteIndex !== null && (
        <DeleteModal
          open={openDialog}
          handleClose={() => setOpenDialog(false)}
          handleConfirm={handleConfirmDelete}
        />
      )}
    </Paper>
  ) : (
    <NotFound title={"No data Found!"} />
  );
};

export default DataTable;
