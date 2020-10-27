const app = require("./app");

app.listen(app.get('PORT'), () => {
  console.log(`Api carry out. Base url: http://localhost:${app.get('PORT')}`);
});
