var express = require("express");
var control = express.Router();
var database = require("../database/database");
var cors = require("cors");
var mqtt = require('mqtt');
var client = mqtt.connect('ws://pi.toannhu.com:8080');
// var client  = mqtt.connect('mqtt://m15.cloudmqtt.com:12071', {
// 	username: 'kbhgwydc',
// 	password: 'H2i6QimmVPWj'
// })

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
					res.status(200).json(appData);
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
					res.status(200).json(appData);
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
					res.status(200).json(appData);
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
					res.status(200).json(appData);
				}
			});
			connection.release();
		}
	});
});




control.get("/getDevices", function(req, res) {
	var appData = {};
	var limit = req.query.limit;
	var node = req.query.node;
	if (node == null || node.length == 0) {
		appData["error"] = 1;
		appData["data"] = "Please send node name to get status!";
		res.status(200).json(appData);
	}
	
	if (isNaN(limit) || limit.length == 0 || limit == null) {
		limit = 20;
	}

	database.connection.getConnection(function(err, connection) {
		if (err) {
			appData["error"] = 1;
			appData["data"] = "Internal Server Error";
			res.status(500).json(appData);
		} else {
			connection.query("SELECT * FROM control where name = ?", [node], function(err, rows, fields) {
				if (!err) {
					appData["error"] = 0;
					appData["data"] = rows;
					res.status(200).json(appData);
				} else {
					appData["error"] = 1;
					appData["data"] = "No data found";
					res.status(200).json(appData);
				}
			});
			connection.release();
		}
	});
});

control.get("/on/", function(req, res) {
	var appData = {};
	var node = req.query.node;
	var device = req.query.device;
	if (node == null || node.length == 0 || device == null || device.length == 0) {
		appData["error"] = 1;
		appData["data"] = "Please send node name and device to control!";
		res.status(200).json(appData);
	}

	database.connection.getConnection(function(err, connection) {
		if (err) {
			appData["error"] = 1;
			appData["data"] = "Internal Server Error";
			res.status(500).json(appData);
		} else {
			connection.query("UPDATE `control` SET " + device + " = '1' WHERE `name` = ?", [node], function(err, rows, fields) {
				if (!err) {
					client.publish('myTopic', JSON.stringify({device: node, status: device}));
					console.log('Message Sent');
					appData["error"] = 0;
					appData["data"] = "Success";
					res.status(200).json(appData);
				} else {
					appData["error"] = 1;
					appData["data"] = "Update fail";
					res.status(200).json(appData);
				}
			});
			connection.release();
		}
	});
});

control.get("/off/", function(req, res) {
	var appData = {};
	var node = req.query.node;
	var device = req.query.device;
	if (node == null || node.length == 0 || device == null || device.length == 0) {
		appData["error"] = 1;
		appData["data"] = "Please send node name and device to control!";
		res.status(200).json(appData);
	}

	database.connection.getConnection(function(err, connection) {
		if (err) {
			appData["error"] = 1;
			appData["data"] = "Internal Server Error";
			res.status(500).json(appData);
		} else {
			connection.query("UPDATE `control` SET " + device + " = '0' WHERE `name` = ?", [node], function(err, rows, fields) {
				if (!err) {
					client.publish('myTopic', JSON.stringify({device: node, status: device}));
					console.log('Message Sent');
					appData["error"] = 0;
					appData["data"] = "Success";
					res.status(200).json(appData);
				} else {
					appData["error"] = 1;
					appData["data"] = "Update fail";
					res.status(200).json(appData);
				}
			});
			connection.release();
		}
	});
});

module.exports = control;
