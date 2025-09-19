import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchBooks = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};

export const getBook = async (id) => {
  const { data } = await axios.get(`${API_URL}/${id}`);
  return data;
};

export const addBook = async (book) => {
  const { data } = await axios.post(API_URL, book);
  return data;
};

export const updateBook = async ({ id, book }) => {
  const { data } = await axios.put(`${API_URL}/${id}`, book);
  return data;
};

export const deleteBook = async (id) => {
  const { data } = await axios.delete(`${API_URL}/${id}`);
  return data;
};
