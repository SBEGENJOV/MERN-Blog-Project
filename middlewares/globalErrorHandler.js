//Hatalı alanlarda vermesi gereken kısım
const globalErrorHandler = (err, req, res, next) => {
  //status
  const status = err?.status ? err?.status : "Hatalı";
  //mesaj
  const message = err?.message;
  //stack
  const stack = err?.stack;
  res.status(500).json({
    status,
    message,
    stack,
  });
};

//404 hatalarında vermesi gereken alan
const notFound = (req, res, next) => {
  const err = new Error(`Aradıgınız bu ${req.originalUrl} sayfa bulunamadı`);
  next(err);
};

module.exports = { notFound, globalErrorHandler };
