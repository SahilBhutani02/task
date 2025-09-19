import * as Yup from "yup";

export const BookSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  author: Yup.string().required("Author is required"),
  genre: Yup.string().required("Genre is required"),
  year: Yup.string()
    .matches(/^[0-9]{4}$/, "Enter a valid year (e.g. 2021)")
    .required("Published year is required"),
  status: Yup.string().required("Status is required"),
});
