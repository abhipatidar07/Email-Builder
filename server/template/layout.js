exports.layoutEmail = (
    title,
    logo,
    name,
    image,
    footer,
    content,
  ) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f9f9f9;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
    }
    .email-header {
      background-color: #4CAF50;
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }
    .email-header img {
  max-width: 150px;
  height: auto;
  display: block;
  margin: 0 auto 10px auto;
  border-radius: 50%; /* Makes the image a circle */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Adds a subtle shadow */
}

    .email-body {
      padding: 20px;
      color: #333333;
      line-height: 1.6;
    }
    .email-body img {
      max-width: 100%;
      height: auto;
      margin: 10px 5px;
      display: block;
    }
    .email-footer {
      background-color: #f1f1f1;
      padding: 10px;
      text-align: center;
      font-size: 12px;
      color: #777777;
    }
    a {
      color: #4CAF50;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <img src=${logo} alt="Company Logo" />
      <h1>${title}</h1>
    </div>
    <div class="email-body">
      <h2>Hello, ${name}</h2>
      <p>
        ${content}
      </p>
      <img src=${image} alt="Sample Image" />
      
    </div>
    <div class="email-footer">
      ${footer}. All rights reserved.
    </div>
  </div>
</body>
</html>
`
  }
  