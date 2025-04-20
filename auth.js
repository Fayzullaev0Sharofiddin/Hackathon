document.addEventListener("DOMContentLoaded", function () {
  // Check if user is already logged in
  if (localStorage.getItem("jwt")) {
    // Validate the token with server
    fetch("http://127.0.0.1:5000/validate-token", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((response) => {
        if (response.ok) {
          window.location.href = "/dashboard.html";
        } else {
          // Token is invalid, remove it
          localStorage.removeItem("jwt");
        }
      })
      .catch((error) => {
        console.error("Error validating token:", error);
        localStorage.removeItem("jwt");
      });
  }

  const form = document.getElementById("totp-form");
  const messageDiv = document.getElementById("message");
  const attemptsSpan = document.getElementById("attempts-count");

  let attempts = 3;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const totpInput = document.getElementById("totp").value;

    // Verify TOTP locally
    const isValid = verifyTOTP(totpInput);

    if (isValid) {
      messageDiv.textContent =
        "Authentication successful! Redirecting to dashboard...";
      messageDiv.className = "success";

      // Log the token to console for testing purposes
      console.log("Successful authentication with token:", totpInput);
      // Request JWT from server
      // fetch("http://127.0.0.1:5000/login", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ token: totpInput }),
      // })
      //   .then((response) => response.json())
      //   .then((data) => {
      //     if (data.token) {
      //       // Store JWT in localStorage
      //       localStorage.setItem("jwt", data.token);

      //       // Redirect to dashboard
      //       setTimeout(() => {
      //         window.location.href = "/dashboard.html";
      //       }, 1500);
      //     }
      //   })
      //   .catch((error) => {
      //     console.error("Error:", error);
      //     messageDiv.textContent = "Server error. Please try again.";
      //     messageDiv.className = "error";
      //   });
    } else {
      attempts--;
      attemptsSpan.textContent = attempts;

      if (attempts <= 0) {
        messageDiv.textContent =
          "Maximum attempts reached. Please try again later.";
        messageDiv.className = "error";
        form.querySelector("button").disabled = true;

        // Disable form for 30 seconds
        setTimeout(() => {
          attempts = 3;
          attemptsSpan.textContent = attempts;
          form.querySelector("button").disabled = false;
          messageDiv.textContent = "You can try again now";
        }, 30000);
      } else {
        messageDiv.textContent = "Invalid token. Please try again.";
        messageDiv.className = "error";
      }
    }

    messageDiv.style.display = "block";
  });
});
