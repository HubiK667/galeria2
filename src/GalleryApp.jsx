import { useState, useEffect } from "react";

const API_KEY = "49562808-6d30763c484d7217a52245597";
const CATEGORIES = {
  nature: "nature",
  city: "city",
  animals: "animals",
};

export default function GalleryApp() {
  const [category, setCategory] = useState(CATEGORIES.nature);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchImages(category);
  }, [category]);

  const fetchImages = async (category) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://pixabay.com/api/?key=${API_KEY}&q=${category}&image_type=photo&per_page=9`
      );
      const data = await response.json();
      console.log("Dane z API:", data); 

      if (data.hits && data.hits.length > 0) {
        setImages(data.hits);
      } else {
        setImages([]);
        setError("Brak wyników dla tej kategorii.");
      }
    } catch (error) {
      console.error("Błąd pobierania zdjęć:", error);
      setError("Błąd pobierania danych.");
    }
    setLoading(false);
  };

  return (
    <div className="gallery-container">
      {/* Przyciski kategorii */}
      <div className="category-buttons">
        {Object.keys(CATEGORIES).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(CATEGORIES[cat])}
            className={`category-button ${category === CATEGORIES[cat] ? "active" : ""}`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Komunikaty: ładowanie / błąd */}
      {loading && <p className="loading">Ładowanie...</p>}
      {error && <p className="error">{error}</p>}

      {/* Galeria zdjęć 3x3 */}
      <div className="image-grid">
        {images.map((img) => (
          <div
            key={img.id}
            onClick={() => setSelectedImage(img.largeImageURL)}
            className="image-card"
          >
            <img
              src={img.webformatURL}
              alt={img.tags}
              className="image"
            />
          </div>
        ))}
      </div>

      {/* Modal do powiększania zdjęć */}
      {selectedImage && (
        <div className="modal" onClick={() => setSelectedImage(null)}>
          <div className="modal-content">
            <img src={selectedImage} alt="Powiększone zdjęcie" className="modal-image" />
          </div>
        </div>
      )}
    </div>
  );
}
