document.addEventListener("DOMContentLoaded", function () {
  const jwt = localStorage.getItem("jwt");

  // Check if JWT exists
  if (!jwt) {
    window.location.href = "/index.html";
    return;
  }

  // Validate JWT with server
  fetch("http://127.0.0.1:5000/validate-token", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + jwt,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Invalid token");
      }
      return response.json();
    })
    .then((data) => {
      // Display user info
      document.getElementById(
        "user-info"
      ).textContent = `User ID: ${data.userId}`;

      // Start session timer
      startSessionTimer();
    })
    .catch((error) => {
      console.error("Error:", error);
      localStorage.removeItem("jwt");
      window.location.href = "/index.html";
    });

  // Handle logout
  document.getElementById("logout").addEventListener("click", function () {
    localStorage.removeItem("jwt");
    window.location.href = "/index.html";
  });

  // Session timer
  function startSessionTimer() {
    let timeLeft = 30 * 60; // 30 minutes in seconds
    const timerElement = document.getElementById("timer");

    const timer = setInterval(() => {
      timeLeft--;

      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;

      timerElement.textContent = `${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

      if (timeLeft <= 0) {
        clearInterval(timer);
        localStorage.removeItem("jwt");
        window.location.href = "/index.html";
      }
    }, 1000);
  }
});
