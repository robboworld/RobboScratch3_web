import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from  './SensorComponent.css';


class CommonFieldsSensorComponent extends Component {

  //Sensors from extension pack


  render() {

    var sensors_data = this.props.sensorData;

      return  (

        <div className={styles.sensor_block_field}  >
            <div className={styles.sensor_block_field}>

                  {`${this.props.NameFieldText} `}

            </div>
            <div className={styles.sensor_block_field}>

                  {
                      (() => {

                            if ((this.props.sensorName  == "nosensor") || (typeof(this.props.sensorName)  == "undefined") || (typeof(sensors_data)  == "undefined") ){

                                return (

                                     <div>

                                        {"---"}

                                     </div>
                                )


                            }else if (this.props.sensorName  == "color"){


                              if (sensors_data[0] == -1){

                                return (

                                     <div>

                                        {"---"}

                                     </div>
                                )

                              }else{

                              return (

                                 <div style={{

                                       backgroundColor: `rgb(${sensors_data[0]},${sensors_data[1]},${sensors_data[2]})`,
                                       minWidth: `10px`,
                                       minHeight: `10px`

                                       }}>



                                 </div>
                              )

                            }


                            }else if (Array.isArray(sensors_data) ){




                               return (   <div>

                                                {sensors_data[3]}

                                          </div>)
                            }else{


                              return (   <div>

                                               {sensors_data}

                                         </div>)

                            }


                        })()


                  }

            </div>
        </div>
                );
}

}



export default CommonFieldsSensorComponent;
