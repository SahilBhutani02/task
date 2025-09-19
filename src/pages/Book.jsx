import { useParams } from "react-router-dom";
import BookForm from "../components/BookForm";

const Book = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-xl mx-4 mt-10 bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          {id ? "Update Book" : "Add New Book"}
        </h2>

        <BookForm />
      </div>
    </div>
  );
};

export default Book;
