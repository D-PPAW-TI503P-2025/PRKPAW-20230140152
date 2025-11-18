import React, { useState, useEffect } from "react";

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    fetch("http://localhost:3001/api/books")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error("Error fetching books:", err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !author) return alert("Judul dan Penulis wajib diisi!");

    if (editId) {
      fetch(`http://localhost:3001/api/books/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author }),
      })
        .then((res) => res.json())
        .then((updatedBook) => {
          setBooks(books.map((b) => (b.id === updatedBook.id ? updatedBook : b)));
          setTitle("");
          setAuthor("");
          setEditId(null);
        });
    } else {
      fetch("http://localhost:3001/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author }),
      })
        .then((res) => res.json())
        .then((newBook) => {
          setBooks([...books, newBook]);
          setTitle("");
          setAuthor("");
        });
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm("Yakin ingin menghapus buku ini?")) return;

    fetch(`http://localhost:3001/api/books/${id}`, {
      method: "DELETE",
    }).then(() => {
      setBooks(books.filter((b) => b.id !== id));
    });
  };

  const handleEdit = (book) => {
    setEditId(book.id);
    setTitle(book.title);
    setAuthor(book.author);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1> Manajemen Buku Perpustakaan</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Judul Buku"
          required
        />
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Penulis"
          required
        />
        <button type="submit">
          {editId ? "💾 Simpan Perubahan" : "➕ Tambah Buku"}
        </button>

        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setTitle("");
              setAuthor("");
            }}
          >
            Batal
          </button>
        )}
      </form>

      <h2>Daftar Buku</h2>
      {books.length === 0 ? (
        <p>Tidak ada data buku.</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {books.map((book) => (
            <li key={book.id} style={{ marginBottom: "10px" }}>
              <strong>{book.title}</strong> — <em>{book.author}</em>
              <div style={{ marginTop: "5px" }}>
                <button onClick={() => handleEdit(book)}>Edit</button>
                <button
                  onClick={() => handleDelete(book.id)}
                  style={{ marginLeft: "10px" }}
                >
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BooksPage;
