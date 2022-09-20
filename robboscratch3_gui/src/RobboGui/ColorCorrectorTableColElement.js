import classNames from 'classnames';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import styles from  './ColorCorrectorTableComponent.css'



class ColorCorrectorTableColElement extends Component {




  render() {


    var row_id = this.props.rowId;
    var col_id = this.props.colId;
    var color_name = this.props.colorName;
    var corrector_name = this.props.correctorName;
    var value = this.props.colorIntervalValue;

      return  (



        <div id={`color-row-${row_id}-col-${col_id}`}

              className={classNames(

                {[styles.color_col]: true},
                {[styles.color_col_inputs]: true}


          )} >
              <input id={`color-${color_name}-corrector-${corrector_name}`} className={classNames(

                  {[styles.correctors_inputs]: true}


                  )}

              type="text" defaultValue={value}>
             </input>

        </div>




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
)(ColorCorrectorTableColElement);
