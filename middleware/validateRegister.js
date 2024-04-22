const validateRegister = (req, res, next) => {
    if (!req.body.first_name) {
      return res.status(422).json({
        status: "Failed",
        message: "First Name is required",
      });
    }
  
    if (!req.body.last_name) {
      return res.status(422).json({
        status: "Failed",
        message: "Last Name is required",
      });
    }
  
    return next();
  };
  
  module.exports = validateRegister;