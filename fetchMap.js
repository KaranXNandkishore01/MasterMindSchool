fetch('https://maps.app.goo.gl/vUjrrdx9cuBK6nK68')
  .then(res => {
      console.log("Redirected URL:", res.url);
      process.exit(0);
  })
  .catch(err => {
      console.error(err);
      process.exit(1);
  });
