<?php
session_start();

// DB Configuration
$servername = "localhost";
$username = "root";
$password = "";
$database = "TS";

$conn = new mysqli($servername, $username, $password, $database);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$error = "";
$success = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $sql = "SELECT * FROM users WHERE email='$email'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            header("refresh:2; Location: index.php");
        } else {
            $error ="Invalid password.";
        }
    } else {
        $error ="No user found with this email.";
    }
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Login - The Serentique</title>
  <style>
    h1{
    margin: auto;
    font-family: fantasy;
    font-size: 3rem;
    padding: 50px 50px;
    align-content: center;
  }
  .description{
    align-items: center;
    font-family: 'Courier New', Courier, monospace;
    font-size: medium;
    padding: 1em;
  }
  .container {
  background-color: transparent;
  padding: 40px;
  width: auto;
}
    body {
  font-family: 'Segoe UI', sans-serif;
  background: #f9f5fc;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

.form-container {
  background-color: #fff;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  width: 400px;
  margin-right: 40px;
}

.form-container h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #4b3b54;
}

input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 8px;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #a68fa1;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

button:hover {
  background-color: #8d7691;
}

.switch-link {
  text-align: center;
  margin-top: 15px;
  color: #666;
}

.switch-link a {
  color: #a68fa1;
  text-decoration: none;
}

.error {
  color: #d9534f;
  text-align: center;
}

.success {
  color: #5cb85c;
  text-align: center;
}
</style>
</head>
<body>
    <div class='container'>
<h1>The Serentique</h1>
<p class='decription'>Welcome to The Serentique Perfume! We are delighted to have you here.
<br>Every fragnance we create tells a unique story, and you just have stepped into a world where scents speak of elegance and charm.
<br> Each bottle hold a journey, crafted with passion, just for you.</br></br></p>
</div>
<div class="form-container">
  <h2>Login</h2>

  <?php if ($error): ?>
    <p class="error"><?= $error ?></p>
  <?php elseif ($success): ?>
    <p class="success"><?= $success ?></p>
  <?php endif; ?>

  <form action="login.php" method="POST">
        <input type="email" name="email" placeholder="Email" required><br>
        <input type="password" name="password" placeholder="Password" required><br>
        <button type="submit">Login</button>
    </form>

  <div class="switch-link">
    Don't have an account? <a href="register.php">Register</a>
  </div>
</div>
</body>
</html>
