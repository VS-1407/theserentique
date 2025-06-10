<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>The Serentique</title>
  <link rel="stylesheet" href="style.css" />
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Great+Vibes&display=swap" rel="stylesheet" />
</head>
<body>

  <header>
      <div class="logo">
        <img src="TS.png" alt="The Serentique Logo" />
      </div>
  </header>

  <section class="hero">
    <div class="container">
      <h1 font-family='Great Vibes'>The Serentique</h1>
      <p class="tagline">“Catches Your Eye, Matches Your Vibe”</p>
      <a href="index.html" class="btn-primary">Home</a>
      <a href="products.php" class="btn-primary">Shop</a>
      <a href="contact.php" class="btn-primary">Contact</a>
      <a href="cart.php" class="btn-primary">Cart</a>
    </div>
  </section>

  <section class="featured-products">
    <div class="container">
      <h2>Featured Perfumes</h2>
      <div class="products-grid">
        <!-- Example product card -->
        <div class="product-card">
          <img src="NE.jpg" alt="Noir Essence" />
          <h3>Noir Essence</h3>
          <p>A floral fragnance with a modern,glamorous twist.</p>
          <span class="price">starting at ₹999</span>
          <a href="product.php?id=1" class="btn-secondary">View Details</a>
        </div>

        <div class="product-card">
          <img src="CL.jpg" alt="Cacao Luxe" />
          <h3>Cacao Luxe</h3>
          <p>A fragnance that blends fresh green notes with peppery spices.</p>
          <span class="price">starting at ₹799</span>
          <a href="product.php?id=2" class="btn-secondary">View Details</a>
        </div>

        <!-- Add more product cards here -->
      </div>
    </div>
  </section>

  <footer>
    <div class="container">
      <p>© 2025 The Serentique. All rights reserved.</p>
      <div class="social-links">
        <a href="https://www.instagram.com/theserentique?igsh=eDFiNW1ob3o1a28w" aria-label="Instagram">Instagram</a>
      </div>
    </div>
  </footer>

</body>
</html>
