import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { BookSchema } from "../schemas/BookSchema";
import { useState } from "react";
import DeleteModal from "./modal/DeleteModal";
import { addBook, deleteBook, getBook, updateBook } from "../services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notifyError, notifySuccess } from "../Utils/toast";
import { genres } from "../Utils/constant";

const BookForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const queryClient = useQueryClient();

  const { data: existingBook, isError } = useQuery({
    queryKey: ["book", id],
    queryFn: () => getBook(id),
    enabled: !!id,
  });

  const addMutation = useMutation({
    mutationFn: addBook,
    onSuccess: () => {
      queryClient.invalidateQueries(["books"]);
      notifySuccess("Book added successfully!");
      navigate("/");
    },
    onError: () => notifyError("Error in adding book!"),
  });

  const updateMutation = useMutation({
    mutationFn: updateBook,
    onSuccess: () => {
      queryClient.invalidateQueries(["books"]);
      notifySuccess("Book updated successfully!");
      navigate("/");
    },
    onError: () => notifyError("Error in updating book!"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries(["books"]);
      notifySuccess("Book deleted successfully!");
    },
    onError: () => {
      notifyError("Error in deleting book!");
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
    navigate("/");
  };

  if (isError) {
    notifyError("Error fetching book details!");
  }

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          title: existingBook?.title || "",
          author: existingBook?.author || "",
          genre: existingBook?.genre || "",
          year: existingBook?.year || "",
          status: existingBook?.status || "",
        }}
        validationSchema={BookSchema}
        onSubmit={(values, { resetForm }) => {
          if (id) {
            updateMutation.mutate({ id, book: values });
            // notifySuccess("Book updated successfully!");
          } else {
            addMutation.mutate(values);
            // notifySuccess("Book added successfully!");
          }
          resetForm();
          navigate("/");
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <Field
                name="title"
                type="text"
                placeholder="Enter book title"
                className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Author
              </label>
              <Field
                name="author"
                type="text"
                placeholder="Enter author name"
                className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
              />
              <ErrorMessage
                name="author"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Genre
              </label>
              <Field
                as="select"
                name="genre"
                className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
              >
                <option value="">Select Genre</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="genre"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Published Year
              </label>
              <Field
                name="year"
                type="text"
                placeholder="Enter year (e.g. 2021)"
                className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
              />
              <ErrorMessage
                name="year"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <Field
                as="select"
                name="status"
                className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
              >
                <option value="">Select Status</option>
                <option value="Available">Available</option>
                <option value="Issued">Issued</option>
              </Field>
              <ErrorMessage
                name="status"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              {id && (
                <button
                  type="button"
                  onClick={() => handleDeleteClick(id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 ${
                  id
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white rounded-lg`}
              >
                {id ? "Update" : "Save"}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      {deleteIndex !== null && (
        <DeleteModal
          open={openDialog}
          handleClose={() => setOpenDialog(false)}
          handleConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
};

export default BookForm;
