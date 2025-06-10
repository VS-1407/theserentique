<?php
session_start();
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "TS";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];
    $perfume_id = $_POST['perfume_id'];
    $sql = "INSERT INTO cart (user_id, perfume_id) VALUES ('$user_id', '$perfume_id')";
    if ($conn->query($sql) === TRUE) {
        echo "<p>Your Fragnance is added to cart!</p>";
    } else {
        echo "Error: " . $conn->error;
    }
}
$sql = "SELECT * FROM products";
$result = $conn->query($sql);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fragnances</title>
    <link rel="stylesheet" href="style.css">
</head>
<body class='products-page'>
    <header>
        <h1>Fragnances For You</h1>
        <nav>
            <a href="index.html" class='pages'>Home</a>
            <a href="products.php" class='pages'>Shop</a>
            <?php if (isset($_SESSION['user_id'])): ?>
                <a href="cart.php" class='pages'>Cart</a>
                <a href="logout.php" class='pages'>Logout</a>
            <?php else: ?>
                <a href="login.php" class='pages'>Login</a>
                <a href="register.php" class='pages'>Register</a>
                <?php endif; ?>
            </nav>
            </header>
            <main>
            <div class="products-list">
            <?php
            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    echo "<div class='product-items'>";
                    echo "<img src='" . $row["image"] . "' alt='" . $row["name"] . "'>";
                    echo "<h3>" . $row["name"] . "</h3>";
                    echo "<h3>" . $row["category"]. "</h3>";
                    echo "<p>" . $row["description"] . "</p>";
                    echo "<p>Price: starting at ₹" . $row["price"] . "</p>";
                    echo '<a href ="product.php?id=".$row["id"]><button>View Details</a></button>';
                    if (isset($_SESSION['user_id'])) {
                        echo "<form action='products.php' method='POST'>";
                        echo "<input type='hidden' name='perfume_id' value='" . $row["id"] . "'>";
                        echo "<button type='submit'>Add to Cart</button>";
                        echo "</form>";
                    }
                    echo "</div>";
                }
            } else {
                echo "<p>No fragnances available.</p>";
            }
            $conn->close();
            ?>
        </div>
    </main>
</body>
</html>