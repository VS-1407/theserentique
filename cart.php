<?php
session_start();
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "TS";

$conn = new mysqli($servername, $username, $password, $dbname);

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

$user_id = $_SESSION['user_id'];
$sql = "SELECT products.name, product.price, order_items.quantity 
        FROM order_items
        JOIN products ON order_items.perfume_id = products.perfume_id 
        WHERE order_items.user_id = '$user_id'";
$result = $conn->query($sql);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cart</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Your Cart</h1>
        <nav>
            <a href="index.php" class='pages'>Home</a>
            <a href="products.php" class='pages'>Shop</a>
            <a href="logout.php" class='pages'>Logout</a>
        </nav>
    </header>
    <main>
        <div class="cart-items">
            <?php
            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    echo "<p>" . $row['title'] . " - ₹" . $row['price'] . " x " . $row['quantity'] . "</p>";
                    echo "<a href='payment.php' class='btn'>Proceed to Payment</a>";

                }
            } else {
                echo "<p>Your cart is empty.</p>";
            }
            
            $conn->close();
            ?>
        </div>
    </main>
</body>
</html>
