
var sensor_types = ["ANALOG","DIGITAL"];
var sensor_names = ["nosensor","ULTRASONIC","COLOR"];
var sensor_version = [""]

class SensorsAPI{



    constructor(){




    }


static getSensorInitType(){

    return sensor_types[0];
}

static getSensorInitName(){

    return sensor_names[0].toLowerCase();
}


}

export default SensorsAPI;
