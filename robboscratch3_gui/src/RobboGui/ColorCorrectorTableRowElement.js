import classNames from 'classnames';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import styles from  './ColorCorrectorTableComponent.css';
import ColorCorrectorTableColElement from './ColorCorrectorTableColElement';



class ColorCorrectorTableRowElement extends Component {

    

  render() {


    var row_id = this.props.rowId;
    var color_name = this.props.colorName.toLowerCase();
    var value = this.props.colorIntervalValue;

    var col_id_to_corrector_arr = ["R","G","B","Bright"];

    var color_filter_table = this.props.RCA.getColorFilterTable(this.props.sensorID);

      return  (



        <div  id={`color-row-${row_id}`} className={styles.color_row}>


            <div id={`color-row-${row_id}-col-1`}

                  className={classNames(

              {[styles.color_col]: true},
              {[styles.color_row_label]: true}



              )} >

                    {color_name}:

            </div>


              {

                    col_id_to_corrector_arr.map(function(corrector,index){


                          return   <ColorCorrectorTableColElement key={`color-row-${row_id}-col-${index+2}`} rowId={row_id} colId={index+2} colorName={color_name} correctorName={corrector}
                                                                  colorIntervalValue={color_filter_table[color_name.toLowerCase()][corrector]}/>
                    })

              }






      {/* row end */}  </div>




              );
}

}

const mapStateToProps =  state => ({





  });

const mapDispatchToProps = dispatch => ({









});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ColorCorrectorTableRowElement);
