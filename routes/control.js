var express = require("express");
var control = express.Router();
var database = require("../database/database");
var cors = require("cors");

control.use(cors());

control.get("/count", function(req, res) {
	var appData = {};

	database.connection.getConnection(function(err, connection) {
		if (err) {
			appData["error"] = 1;
			appData["data"] = "Internal Server Error";
			res.status(500).json(appData);
		} else {
			connection.query("SELECT count(plant) FROM south", function(err, rows, fields) {
				if (!err) {
					appData["error"] = 0;
					appData["data"] = rows;
					res.status(200).json(appData);
				} else {
					appData["error"] = 1;
					appData["data"] = "No data found";
					res.status(204).json(appData);
				}
			});
			connection.release();
		}
	});
});

control.get("/get", function(req, res) {
	var appData = {};
	var limit = req.query.limit;
	if (isNaN(limit) || limit.length == 0 || limit.length == null) {
		limit = 20;
	}

	database.connection.getConnection(function(err, connection) {
		if (err) {
			appData["error"] = 1;
			appData["data"] = "Internal Server Error";
			res.status(500).json(appData);
		} else {
			connection.query("SELECT plant, day, period, temp_min, temp_max, humd, light, near FROM south limit " + limit, function(err, rows, fields) {
				if (!err) {
					appData["error"] = 0;
					appData["data"] = rows;
					res.status(200).json(appData);
				} else {
					appData["error"] = 1;
					appData["data"] = "No data found";
					res.status(204).json(appData);
				}
			});
			connection.release();
		}
	});
});

control.get("/all", function(req, res) {
	var appData = {};

	database.connection.getConnection(function(err, connection) {
		if (err) {
			appData["error"] = 1;
			appData["data"] = "Internal Server Error";
			res.status(500).json(appData);
		} else {
			connection.query("SELECT plant, day, period, temp_min, temp_max, humd, light, near FROM south", function(err, rows, fields) {
				if (!err) {
					appData["error"] = 0;
					appData["data"] = rows;
					res.status(200).json(appData);
				} else {
					appData["error"] = 1;
					appData["data"] = "No data found";
					res.status(204).json(appData);
				}
			});
			connection.release();
		}
	});
});

control.get("/filter", function(req, res) {
	var appData = {};
	var input = req.query.input;

	database.connection.getConnection(function(err, connection) {
		if (err) {
			appData["error"] = 1;
			appData["data"] = "Internal Server Error";
			res.status(500).json(appData);
		} else {
			connection.query("SELECT plant, day, period, temp_min, temp_max, humd, light, near FROM south where plant like '%" + input + "%'", function(err, rows, fields) {
				if (!err) {
					appData["error"] = 0;
					appData["data"] = rows;
					res.status(200).json(appData);
				} else {
					appData["error"] = 1;
					appData["data"] = "No data found";
					res.status(204).json(appData);
				}
			});
			connection.release();
		}
	});
});




control.get("/getLedStatus", function(req, res) {
	var appData = {};
	var limit = req.query.limit;
	if (isNaN(limit) || limit.length == 0 || limit.length == null) {
		limit = 20;
	}

	database.connection.getConnection(function(err, connection) {
		if (err) {
			appData["error"] = 1;
			appData["data"] = "Internal Server Error";
			res.status(500).json(appData);
		} else {
			connection.query("SELECT * FROM led", function(err, rows, fields) {
				if (!err) {
					appData["error"] = 0;
					appData["data"] = rows;
					res.status(200).json(appData);
				} else {
					appData["error"] = 1;
					appData["data"] = "No data found";
					res.status(204).json(appData);
				}
			});
			connection.release();
		}
	});
});

control.get("/on/:id", function(req, res) {
	var appData = {};
	var id = req.params.id;

	database.connection.getConnection(function(err, connection) {
		if (err) {
			appData["error"] = 1;
			appData["data"] = "Internal Server Error";
			res.status(500).json(appData);
		} else {
			connection.query("UPDATE `led` SET `status` = '1' WHERE `id` = ?", [id], function(err, rows, fields) {
				if (!err) {
					appData["error"] = 0;
					appData["data"] = "Success";
					res.status(200).json(appData);
				} else {
					appData["error"] = 1;
					appData["data"] = "Update fail";
					res.status(204).json(appData);
				}
			});
			connection.release();
		}
	});
});

control.get("/off/:id", function(req, res) {
	var appData = {};
	var id = req.params.id;

	database.connection.getConnection(function(err, connection) {
		if (err) {
			appData["error"] = 1;
			appData["data"] = "Internal Server Error";
			res.status(500).json(appData);
		} else {
			connection.query("UPDATE `led` SET `status` = '0' WHERE `id` = ?", [id], function(err, rows, fields) {
				if (!err) {
					appData["error"] = 0;
					appData["data"] = "Success";
					res.status(200).json(appData);
				} else {
					appData["error"] = 1;
					appData["data"] = "Update fail";
					res.status(204).json(appData);
				}
			});
			connection.release();
		}
	});
});

module.exports = control;
