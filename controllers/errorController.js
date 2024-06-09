exports.get404 = (req, res, next) => {
    res.status(404).render('errors/404');
};

exports.get500 = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('errors/500');
};
